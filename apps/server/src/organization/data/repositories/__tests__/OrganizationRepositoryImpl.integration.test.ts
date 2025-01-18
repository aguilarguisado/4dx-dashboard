import { resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { ORGANIZATION_COLLECTION_PATH, OrganizationRepositoryImpl } from '../OrganizationRepositoryImpl';

import { Container } from 'inversify';

describe('OrganizationRepositoryImpl', () => {
	let repo: OrganizationRepositoryImpl;
	let container: Container;

	beforeEach(async () => {
		container = resetTestAppContainer();
		repo = container.get(Symbol.for('OrganizationRepository'));
	});

	describe('getCollectionPath', () => {
		it('should successfully get the collection path', async () => {
			const result = repo.getCollectionPath();
			expect(result).toEqual(ORGANIZATION_COLLECTION_PATH);
		});
	});
});
