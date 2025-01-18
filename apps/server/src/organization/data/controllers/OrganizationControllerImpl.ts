import { genericApiErrorConverter } from '../../../common/data/exceptions/utils';
import { CreateOrganizationUseCase } from '../../domain/usecases/CreateOrganizationUseCase';
import { CreateOrganizationDTO, toCreateOrganizationModel } from '../dtos/CreateOrganizationDTO';

import { inject, injectable } from 'inversify';

@injectable()
export class OrganizationControllerImpl {
	constructor(@inject(CreateOrganizationUseCase) private createOrganizationUseCase: CreateOrganizationUseCase) {}

	async createOrganization(createOrganizationDTO: CreateOrganizationDTO) {
		const createOrganization = toCreateOrganizationModel(createOrganizationDTO);
		return (await this.createOrganizationUseCase.execute(createOrganization))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}
}
