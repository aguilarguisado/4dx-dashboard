import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { NotPermissionError } from '../../../common/domain/exceptions/NotPermissionError';
import { SLAError } from '../../../common/domain/exceptions/SLAError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { IdModel } from '../../../common/domain/models/BaseModel';
import { Void } from '../../../common/domain/models/Void';
import { OrganizationRepository } from '../../../organization/domain/repositories/OrganizationRepository';
import { ScoreboardHistoryType } from '../../../scoreboard/domain/models/ScoreboardHistory';
import { ScoreboardHistoryRepository } from '../../../scoreboard/domain/repositories/ScoreboardHistoryRepository';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIG } from '../models/WIG';
import { WIGRepository } from '../repositories/WIGRepository';
import { CreateLag } from '../types/CreateLag';
import { CreateLead } from '../types/CreateLead';
import { CreateWIG } from '../types/CreateWIG';
import { LagMeasurement } from '../types/LagMeasurement';
import { LeadMeasurement } from '../types/LeadMeasurement';
import { Scoreboard, ScoreboardEntry, validateScoreboard } from '../types/Scoreboard';
import { UpdateGeneralSection } from '../types/UpdateGeneralSection';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync, Left, Right } from 'purify-ts';
import { v4 as uuid } from 'uuid';

export const MAX_WIGS_PER_ORGANIZATION = 5;
export const MAX_LEADS_PER_WIG = 2;
export const MAX_LAGS_PER_WIG = 2;

@injectable()
export class WIGInteractor {
	constructor(
		@inject(Symbol.for('WIGRepository')) private wigRepository: WIGRepository,
		@inject(Symbol.for('OrganizationRepository')) private organizationRepository: OrganizationRepository,
		@inject(Symbol.for('ScoreboardHistoryRepository'))
		private scoreboardHistoryRepository: ScoreboardHistoryRepository,
	) {}

	public async getWIGListFromOrganization(organizationId: string): Promise<Either<UnknownError, WIG[]>> {
		return this.wigRepository.getWIGListFromOrganization(organizationId);
	}

	public async getWIGFromOrganization(organizationId: string, wigId: string): Promise<Either<GetWIGError, WIG>> {
		return this.wigRepository.getWIGFromOrganization(organizationId, wigId);
	}

	public async create(
		organizationId: string,
		createWIG: CreateWIG,
	): Promise<Either<UnknownError | EntityNotExistsError | SLAError, IdModel>> {
		return EitherAsync<UnknownError | EntityNotExistsError | SLAError, IdModel>(async ({ fromPromise, throwE }) => {
			const organization = await fromPromise(this.organizationRepository.find(organizationId));
			if (organization.wigCount >= MAX_WIGS_PER_ORGANIZATION) {
				return throwE(new SLAError('Max WIGs reached'));
			}
			if (createWIG.isOrganizational) {
				await fromPromise(this.removeOrganizationalWIG(organizationId));
			}
			const wig = await fromPromise(this.wigRepository.create({ ...createWIG, organizationId }));
			await fromPromise(
				this.organizationRepository.write(organizationId, { wigCount: (organization.wigCount || 0) + 1 }),
			);
			return { id: wig.id };
		});
	}

	public async update(updateWIG: UpdateGeneralSection): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		if (!updateWIG.isOrganizational) {
			return this.wigRepository.write(updateWIG.id, updateWIG);
		} else {
			return EitherAsync.fromPromise(() => this.wigRepository.find(updateWIG.id))
				.chain((wig) => {
					const wasOrganizational = wig?.isOrganizational;
					if (wasOrganizational) {
						return this.removeOrganizationalWIG(wig.organizationId);
					} else {
						return Promise.resolve(Right(undefined));
					}
				})
				.chain(() => this.wigRepository.write(updateWIG.id, updateWIG));
		}
	}

	public async delete(
		organizationId: string,
		wigId: string,
	): Promise<Either<UnknownError | EntityNotExistsError | NotPermissionError, Void>> {
		return EitherAsync.fromPromise(() => this.wigRepository.getWIGFromOrganization(organizationId, wigId))
			.chain(() => this.wigRepository.delete(wigId))
			.chain(() => this.organizationRepository.find(organizationId))
			.chain((organization) =>
				this.organizationRepository.write(organizationId, { wigCount: (organization.wigCount || 1) - 1 }),
			);
	}

	// Lead
	public async addLead(
		wig: WIG,
		lead: CreateLead,
	): Promise<Either<UnknownError | EntityNotExistsError | SLAError | IllegalStateError, LeadMeasurement>> {
		const leads = wig?.leads || [];
		if (leads.length >= MAX_LEADS_PER_WIG) {
			return Left(new SLAError('Max leads reached'));
		}

		if (lead.scoreboard) {
			const hasErrors = validateScoreboard(lead.scoreboard);
			if (hasErrors) {
				return Left(new IllegalStateError('Error scoreboard has invalid schema'));
			}
		}

		const newLead = { ...lead, id: uuid() };
		return this.wigRepository.addLead(wig.id, newLead);
	}

	public async updateLead(
		wig: WIG,
		lead: LeadMeasurement,
	): Promise<Either<UnknownError | EntityNotExistsError | IllegalStateError, LeadMeasurement>> {
		if (lead.scoreboard) {
			const hasErrors = validateScoreboard(lead.scoreboard);
			if (hasErrors) {
				return Left(new IllegalStateError('Error scoreboard has invalid schema'));
			}
		}
		return this.wigRepository.updateLead(wig.id, lead);
	}

	public async deleteLead(wig: WIG, leadId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		return this.wigRepository.deleteLead(wig.id, leadId);
	}

	// Lag
	public async addLag(
		wig: WIG,
		lag: CreateLag,
	): Promise<Either<UnknownError | EntityNotExistsError | SLAError | IllegalStateError, LagMeasurement>> {
		const lags = wig?.lags || [];
		if (lags.length >= MAX_LAGS_PER_WIG) {
			return Left(new SLAError('Max lags reached'));
		}
		if (lag.scoreboard) {
			const hasErrors = validateScoreboard(lag.scoreboard);
			if (hasErrors) {
				return Left(new IllegalStateError('Error scoreboard has invalid schema'));
			}
		}
		const newLag = { ...lag, id: uuid() };
		return this.wigRepository.addLag(wig.id, newLag);
	}

	public async updateLag(
		wig: WIG,
		lag: LagMeasurement,
	): Promise<Either<UnknownError | EntityNotExistsError | IllegalStateError, LagMeasurement>> {
		if (lag.scoreboard) {
			const hasErrors = validateScoreboard(lag.scoreboard);
			if (hasErrors) {
				return Left(new IllegalStateError('Error scoreboard has invalid schema'));
			}
		}
		return this.wigRepository.updateLag(wig.id, lag);
	}

	public async deleteLag(wig: WIG, lagId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		return this.wigRepository.deleteLag(wig.id, lagId);
	}

	// Scoreboard
	public async setScoreboard(
		wigId: string,
		scoreboard: Scoreboard,
	): Promise<Either<GetWIGError | IllegalStateError, WIG>> {
		const hasErrors = validateScoreboard(scoreboard);
		if (hasErrors) {
			return Left(new IllegalStateError('Error scoreboard has invalid schema'));
		}
		return this.wigRepository.setScoreboard(wigId, scoreboard);
	}

	public async clearScoreboardData(wigId: string): Promise<Either<UnknownError | IllegalStateError, Void>> {
		return this.wigRepository.clearScoreboardData(wigId);
	}

	public async deleteScoreboard(wigId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		return this.wigRepository.removeScoreboard(wigId);
	}

	public async refreshScoreboard(
		wig: WIG,
		scoreboardId: string,
		containerType: ScoreboardHistoryType,
	): Promise<Either<UnknownError | IllegalStateError | EntityNotExistsError, Scoreboard>> {
		switch (containerType) {
			case 'wig':
				return this.refreshWIGScoreboard(wig, scoreboardId);
			case 'lead':
				return this.refreshLeadScoreboard(wig, scoreboardId);
			case 'lag':
				return this.refreshLagScoreboard(wig, scoreboardId);
			default:
				return Left(new IllegalStateError('Invalid container type'));
		}
	}

	// Auxiliary methods
	private async refreshWIGScoreboard(
		wig: WIG,
		scoreboardId: string,
	): Promise<Either<UnknownError | EntityNotExistsError, Scoreboard>> {
		return EitherAsync(async ({ fromPromise, throwE }) => {
			if (!wig.scoreboard || wig.scoreboard.id !== scoreboardId) {
				return throwE(new EntityNotExistsError('Scoreboard not found for WIG'));
			}

			const entries = await fromPromise(this.getEntries(scoreboardId));
			wig.scoreboard.data = entries;
			await fromPromise(this.wigRepository.write(wig.id, wig));
			return wig.scoreboard;
		});
	}

	private async refreshLagScoreboard(
		wig: WIG,
		scoreboardId: string,
	): Promise<Either<UnknownError | EntityNotExistsError, Scoreboard>> {
		return EitherAsync(async ({ fromPromise, throwE }) => {
			const lag = wig?.lags?.find((lag: LagMeasurement) => lag.scoreboard?.id === scoreboardId);
			if (!lag || !lag.scoreboard) {
				return throwE(new EntityNotExistsError('Scoreboard for lag not found'));
			}
			const entries = await fromPromise(this.getEntries(scoreboardId));
			lag.scoreboard.data = entries;
			await this.wigRepository.updateLag(wig.id, lag);
			return lag.scoreboard;
		});
	}

	private async refreshLeadScoreboard(
		wig: WIG,
		scoreboardId: string,
	): Promise<Either<UnknownError | EntityNotExistsError, Scoreboard>> {
		return EitherAsync(async ({ fromPromise, throwE }) => {
			const lead = wig?.leads?.find((lead: LeadMeasurement) => lead.scoreboard?.id === scoreboardId);
			if (!lead || !lead.scoreboard) {
				return throwE(new EntityNotExistsError('Lag or scoreboard not found'));
			}
			const entries = await fromPromise(this.getEntries(scoreboardId));
			lead.scoreboard.data = entries;
			await this.wigRepository.updateLead(wig.id, lead);
			return lead.scoreboard;
		});
	}

	private async getEntries(scoreboardId: string): Promise<Either<UnknownError, ScoreboardEntry[]>> {
		return EitherAsync(async ({ fromPromise }) => {
			const latestEntries = await fromPromise(
				this.scoreboardHistoryRepository.getLatestScoreboardEntries(scoreboardId),
			);
			return latestEntries.map((entry) => ({
				label: entry.date,
				value: entry.value,
			}));
		});
	}

	private async removeOrganizationalWIG(
		organizationId: string,
	): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		return EitherAsync.fromPromise(() => this.wigRepository.getOrganizationalWIGs(organizationId)).chain(
			(organizationalWIGs) => {
				organizationalWIGs.forEach(async (wig) => {
					await this.wigRepository.write(wig.id, { isOrganizational: false });
				});
				return Promise.resolve(Right(undefined));
			},
		);
	}
}
