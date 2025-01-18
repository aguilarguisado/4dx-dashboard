import { FirestoreRepositoryImpl } from '../../../common/data/FirestoreRepositoryImpl';
import { Organization } from '../../domain/models/Organization';
import { OrganizationRepository } from '../../domain/repositories/OrganizationRepository';

import { injectable } from 'inversify';

export const ORGANIZATION_COLLECTION_PATH = 'organization';

@injectable()
export class OrganizationRepositoryImpl
	extends FirestoreRepositoryImpl<Organization>
	implements OrganizationRepository
{
	getCollectionPath(): string {
		return ORGANIZATION_COLLECTION_PATH;
	}
}
