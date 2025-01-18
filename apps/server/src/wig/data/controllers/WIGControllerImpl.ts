import { BadRequestApiError } from '../../../common/data/exceptions/BadRequestApiError';
import { genericApiErrorConverter } from '../../../common/data/exceptions/utils';
import { CreateLead } from '../../domain/types/CreateLead';
import { CreateLagUseCase } from '../../domain/usecases/CreateLagUseCase';
import { CreateLeadUseCase } from '../../domain/usecases/CreateLeadUseCase';
import { CreateScoreboardUseCase } from '../../domain/usecases/CreateScoreboardUseCase';
import { CreateWIGUseCase } from '../../domain/usecases/CreateWIGUseCase';
import { DeleteLagUseCase } from '../../domain/usecases/DeleteLagUseCase';
import { DeleteLeadUseCase } from '../../domain/usecases/DeleteLeadUseCase';
import { DeleteScoreboardUseCase } from '../../domain/usecases/DeleteScoreboardUseCase';
import { DeleteWIGUseCase } from '../../domain/usecases/DeleteWIGUseCase';
import { GetWIGListUseCase } from '../../domain/usecases/GetWIGListUseCase';
import { GetWIGUseCase } from '../../domain/usecases/GetWIGUseCase';
import { UpdateLagUseCase } from '../../domain/usecases/UpdateLagUseCase';
import { UpdateLeadUseCase } from '../../domain/usecases/UpdateLeadUseCase';
import { UpdateScoreboardUseCase } from '../../domain/usecases/UpdateScoreboardUseCase';
import { UpdateWIGUseCase } from '../../domain/usecases/UpdateWIGUseCase';
import { CreateLagDTO, toCreateLagModel } from '../dtos/CreateLagDTO';
import { CreateLeadDTO, toCreateLeadModel } from '../dtos/CreateLeadDTO';
import { CreateWIGDTO, toCreateWIGModel } from '../dtos/CreateWIGDTO';
import { toUpdateGeneralSectionModel, UpdateGeneralSectionDTO } from '../dtos/UpdateGeneralSectionDTO';
import { toLagModel, UpdateLagDTO } from '../dtos/UpdateLagDTO';
import { toLeadModel, UpdateLeadDTO } from '../dtos/UpdateLeadDTO';
import { toWIGScoreboardModel, WIGScoreboardDTO } from '../dtos/WIGScoreboardDTO';

import { inject, injectable } from 'inversify';

@injectable()
export class WIGControllerImpl {
	constructor(
		@inject(GetWIGUseCase) private getWIGUseCase: GetWIGUseCase,
		@inject(GetWIGListUseCase) private getWIGListUseCase: GetWIGListUseCase,
		@inject(CreateWIGUseCase) private createWIGUseCase: CreateWIGUseCase,
		@inject(UpdateWIGUseCase) private updateWIGUseCase: UpdateWIGUseCase,
		@inject(DeleteWIGUseCase) private deleteWIGUseCase: DeleteWIGUseCase,
		@inject(CreateLeadUseCase) private addWIGLeadUseCase: CreateLeadUseCase,
		@inject(UpdateLeadUseCase) private updateWIGLeadUseCase: UpdateLeadUseCase,
		@inject(DeleteLeadUseCase) private deleteWIGLeadUseCase: DeleteLeadUseCase,
		@inject(CreateLagUseCase) private addWIGLagUseCase: CreateLagUseCase,
		@inject(UpdateLagUseCase) private updateWIGLagUseCase: UpdateLagUseCase,
		@inject(DeleteLagUseCase) private deleteWIGLagUseCase: DeleteLagUseCase,
		@inject(CreateScoreboardUseCase) private createScoreboardUseCase: CreateScoreboardUseCase,
		@inject(UpdateScoreboardUseCase) private updateScoreboardUseCase: UpdateScoreboardUseCase,
		@inject(DeleteScoreboardUseCase) private deleteScoreboardUseCase: DeleteScoreboardUseCase,
	) {}

	async getWIGs(organizationId: string) {
		return (await this.getWIGListUseCase.execute(organizationId)).mapLeft(genericApiErrorConverter).unsafeCoerce();
	}

	async createWIG(organizationId: string, createWIGDTO: CreateWIGDTO) {
		const createWIG = toCreateWIGModel(createWIGDTO);
		return (await this.createWIGUseCase.execute(organizationId, createWIG))
			.mapLeft((error) => {
				switch (error.kind) {
					case 'SLAError':
						throw new BadRequestApiError({ id: 'sla.max_wig_reached' });
					default:
						throw genericApiErrorConverter(error);
				}
			})
			.unsafeCoerce();
	}

	async updateWIG(organizationId: string, updateGeneralSectionDTO: UpdateGeneralSectionDTO) {
		const updateWIG = toUpdateGeneralSectionModel(updateGeneralSectionDTO);
		return (await this.updateWIGUseCase.execute(organizationId, updateWIG))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async deleteWIG(organizationId: string, wigId: string) {
		return (await this.deleteWIGUseCase.execute(organizationId, wigId))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async getWIGFromOrganization(organizationId: string, wigId: string) {
		return (await this.getWIGUseCase.execute(organizationId, wigId))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async addWIGLead(organizationId: string, createLeadDTO: CreateLeadDTO) {
		const { wigId } = createLeadDTO;
		const createLead: CreateLead = toCreateLeadModel(createLeadDTO);
		return (await this.addWIGLeadUseCase.execute(organizationId, wigId, createLead))
			.mapLeft((error) => {
				if (error.kind === 'SLAError') {
					throw new BadRequestApiError({ id: 'sla.max_lead_reached' });
				}
				return genericApiErrorConverter(error);
			})
			.unsafeCoerce();
	}

	async updateWIGLead(organizationId: string, updateLeadDTO: UpdateLeadDTO) {
		const { wigId } = updateLeadDTO;
		const lead = toLeadModel(updateLeadDTO);
		return (await this.updateWIGLeadUseCase.execute(organizationId, wigId, lead))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async deleteWIGLead(organizationId: string, wigId: string, leadId: string) {
		return (await this.deleteWIGLeadUseCase.execute(organizationId, wigId, leadId))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async addWIGLag(organizationId: string, createLagDTO: CreateLagDTO) {
		const { wigId } = createLagDTO;
		const createLag = toCreateLagModel(createLagDTO);
		return (await this.addWIGLagUseCase.execute(organizationId, wigId, createLag))
			.mapLeft((error) => {
				if (error.kind === 'SLAError') {
					throw new BadRequestApiError({ id: 'sla.max_lag_reached' });
				}
				return genericApiErrorConverter(error);
			})
			.unsafeCoerce();
	}

	async updateWIGLag(organizationId: string, updateLagDTO: UpdateLagDTO) {
		const { wigId } = updateLagDTO;
		const lead = toLagModel(updateLagDTO);
		return (await this.updateWIGLagUseCase.execute(organizationId, wigId, lead))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async deleteWIGLag(organizationId: string, wigId: string, leadId: string) {
		return (await this.deleteWIGLagUseCase.execute(organizationId, wigId, leadId))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async createScoreboard(organizationId: string, wigScoreboardDTO: WIGScoreboardDTO) {
		const { wigId } = wigScoreboardDTO;
		const createScoreboard = toWIGScoreboardModel(wigScoreboardDTO);
		return (await this.createScoreboardUseCase.execute(organizationId, wigId, createScoreboard))
			.mapLeft((error) => {
				if (error.kind === 'IllegalStateError') {
					throw new BadRequestApiError({ id: 'wig.scoreboard.error.exists' });
				}
				return genericApiErrorConverter(error);
			})
			.unsafeCoerce();
	}

	async updateScoreboard(organizationId: string, wigScoreboardDTO: WIGScoreboardDTO) {
		const { wigId } = wigScoreboardDTO;
		const updateScoreboard = toWIGScoreboardModel(wigScoreboardDTO);
		return (await this.updateScoreboardUseCase.execute(organizationId, wigId, updateScoreboard))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}

	async deleteScoreboard(organizationId: string, wigId: string) {
		return (await this.deleteScoreboardUseCase.execute(organizationId, wigId))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}
}
