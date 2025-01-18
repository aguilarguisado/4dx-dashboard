import { buildUnknownError } from '../../../common/data/exceptions/utils';
import { FirestoreRepositoryImpl } from '../../../common/data/FirestoreRepositoryImpl';
import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { NotPermissionError } from '../../../common/domain/exceptions/NotPermissionError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { Void } from '../../../common/domain/models/Void';
import { GetWIGError } from '../../domain/exceptions/GetWIGError';
import { WIG } from '../../domain/models/WIG';
import { WIGRepository } from '../../domain/repositories/WIGRepository';
import { LagMeasurement } from '../../domain/types/LagMeasurement';
import { LeadMeasurement } from '../../domain/types/LeadMeasurement';
import { Scoreboard } from '../../domain/types/Scoreboard';

import { FieldValue } from '@google-cloud/firestore';
import { injectable } from 'inversify';
import { Either, Left, Right } from 'purify-ts';

const WIG_COLLECTION_PATH = 'wig';

@injectable()
export class WIGRepositoryImpl extends FirestoreRepositoryImpl<WIG> implements WIGRepository {
	getCollectionPath(): string {
		return WIG_COLLECTION_PATH;
	}

	async getWIGListFromOrganization(organizationId: string): Promise<Either<UnknownError, WIG[]>> {
		try {
			const querySnapshot = await this.getCollection().where('organizationId', '==', organizationId).get();
			const wigList = this.mapQuerySnapshotToEntities(querySnapshot);
			return Right(wigList);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	async getWIGFromOrganization(organizationId: string, wigId: string): Promise<Either<GetWIGError, WIG>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			const docSnapshot = await wigDocRef.get();
			const document = docSnapshot.data();

			if (!docSnapshot.exists || !document) {
				return Left(new EntityNotExistsError(`WIG with id ${wigId} not found`));
			}

			const wig = this.mapDocumentDataToEntity(document);

			if (wig.organizationId !== organizationId) {
				return Left(
					new NotPermissionError(
						`WIG with id ${wigId} does not belong to organization with id ${organizationId}`,
					),
				);
			}

			return Right(wig);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async getOrganizationalWIGs(organizationId: string): Promise<Either<UnknownError, WIG[]>> {
		try {
			const querySnapshot = await this.getCollection()
				.where('organizationId', '==', organizationId)
				.where('isOrganizational', '==', true)
				.get();
			return Right(this.mapQuerySnapshotToEntities(querySnapshot));
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async addLead(wigId: string, lead: LeadMeasurement): Promise<Either<UnknownError, LeadMeasurement>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			await wigDocRef.update({
				leads: FieldValue.arrayUnion(lead),
			});
			return Right(lead);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async updateLead(
		wigId: string,
		lead: LeadMeasurement,
	): Promise<Either<UnknownError | EntityNotExistsError, LeadMeasurement>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			const wigDoc = await wigDocRef.get();

			if (!wigDoc.exists) {
				return Left(new EntityNotExistsError('WIG not found'));
			}

			const wigData = this.mapDocumentDataToEntity(wigDoc.data() as WIG);
			const leads = wigData?.leads || [];

			const newLeads = leads.map((leadMeasurement: LeadMeasurement) => {
				if (leadMeasurement.id === lead.id) {
					if (lead.scoreboard) {
						lead.scoreboard = { ...leadMeasurement.scoreboard, ...lead.scoreboard };
					}
					return lead;
				}
				return leadMeasurement;
			});

			const updatedLead = newLeads.find((leadMeasurement: LeadMeasurement) => leadMeasurement.id === lead.id);
			if (!updatedLead) {
				return Left(new EntityNotExistsError('Lead not found'));
			}

			await wigDocRef.update({
				leads: newLeads,
			});

			return Right(updatedLead);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async deleteLead(wigId: string, leadId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			const wigDoc = await wigDocRef.get();

			if (!wigDoc.exists) {
				return Left(new EntityNotExistsError('WIG not found'));
			}

			const wigData = wigDoc.data();
			const leads = wigData?.leads || [];

			if (!leads.some((leadMeasurement: LeadMeasurement) => leadMeasurement.id === leadId)) {
				return Left(new EntityNotExistsError('Lead not found'));
			}
			const newLeads = leads.filter((lead: LeadMeasurement) => lead.id !== leadId);

			await wigDocRef.update({
				leads: newLeads,
			});

			return Right(undefined);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async addLag(wigId: string, lag: LagMeasurement): Promise<Either<UnknownError, LagMeasurement>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			await wigDocRef.update({
				lags: FieldValue.arrayUnion(lag),
			});
			return Right(lag);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async updateLag(
		wigId: string,
		lag: LagMeasurement,
	): Promise<Either<UnknownError | EntityNotExistsError, LagMeasurement>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			const wigDoc = await wigDocRef.get();

			if (!wigDoc.exists) {
				return Left(new EntityNotExistsError('WIG not found'));
			}

			const wigData = this.mapDocumentDataToEntity(wigDoc.data() as WIG);
			const lags = wigData?.lags || [];

			const newLags = lags.map((lagMeasurement: LagMeasurement) => {
				if (lagMeasurement.id === lag.id) {
					if (lag.scoreboard) {
						lag.scoreboard = { ...lagMeasurement.scoreboard, ...lag.scoreboard };
					}
					return lag;
				}
				return lagMeasurement;
			});

			const updatedLag = newLags.find((lagMeasurement: LagMeasurement) => lagMeasurement.id === lag.id);
			if (!updatedLag) {
				return Left(new EntityNotExistsError('Lag not found'));
			}

			await wigDocRef.update({
				lags: newLags,
			});

			return Right(updatedLag);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async deleteLag(wigId: string, lagId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			const wigDoc = await wigDocRef.get();

			if (!wigDoc.exists) {
				return Left(new EntityNotExistsError('WIG not found'));
			}

			const wigData = wigDoc.data();
			const lags = wigData?.lags || [];

			if (!lags.some((lagMeasurement: LagMeasurement) => lagMeasurement.id === lagId)) {
				return Left(new EntityNotExistsError('Lag not found'));
			}
			const newLags = lags.filter((lag: LagMeasurement) => lag.id !== lagId);

			await wigDocRef.update({
				lags: newLags,
			});

			return Right(undefined);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async setScoreboard(wigId: string, scoreboard: Scoreboard): Promise<Either<GetWIGError, WIG>> {
		try {
			const wigDocRef = this.getCollection().doc(wigId);
			await wigDocRef.update({ scoreboard });
			return this.find(wigId);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async clearScoreboardData(wigId: string): Promise<Either<UnknownError, Void>> {
		try {
			await this.setFieldsToUndefined(wigId, ['scoreboard.data']);
			return Right(undefined);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async removeScoreboard(wigId: string): Promise<Either<UnknownError, Void>> {
		try {
			await this.setFieldsToUndefined(wigId, ['scoreboard']);
			return Right(undefined);
		} catch (error) {
			return buildUnknownError(error);
		}
	}
}
