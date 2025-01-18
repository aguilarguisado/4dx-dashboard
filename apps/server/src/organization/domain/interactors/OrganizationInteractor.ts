import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { CreateOrganization, Organization } from '../models/Organization';
import { OrganizationRepository } from '../repositories/OrganizationRepository';

import { inject, injectable } from 'inversify';
import { Either } from 'purify-ts';

@injectable()
export class OrganizationInteractor {
	constructor(@inject(Symbol.for('OrganizationRepository')) private organizationRepository: OrganizationRepository) {}

	public async find(organizationId: string): Promise<Either<UnknownError | EntityNotExistsError, Organization>> {
		return this.organizationRepository.find(organizationId);
	}

	public async create(createOrganization: CreateOrganization): Promise<Either<UnknownError, Organization>> {
		return this.organizationRepository.create({ ...createOrganization, wigCount: 0 });
	}
}
