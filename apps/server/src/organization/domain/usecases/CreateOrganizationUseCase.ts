import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { UseCase } from '../../../common/domain/UseCase';
import { OrganizationInteractor } from '../interactors/OrganizationInteractor';
import { CreateOrganization, Organization } from '../models/Organization';

import { inject, injectable } from 'inversify';
import { Either } from 'purify-ts';

@injectable()
export class CreateOrganizationUseCase implements UseCase<Organization> {
	constructor(@inject(OrganizationInteractor) private organizationInteractor: OrganizationInteractor) {}

	public async execute(createOrganization: CreateOrganization): Promise<Either<UnknownError, Organization>> {
		return this.organizationInteractor.create(createOrganization);
	}
}
