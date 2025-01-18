import { resetDB } from '../../../lib/firestore/FirestoreDB';
import { EntityNotExistsError } from '../../domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../../domain/exceptions/UnknownError';
import { FirestoreRepositoryImpl } from '../FirestoreRepositoryImpl';

class TestEntity {
	constructor(
		public id: string,
		public name: string,
		public description: string,
	) {}
}

class MyFirestoreRepositoryImpl extends FirestoreRepositoryImpl<TestEntity> {
	getCollectionPath() {
		return 'test_firestore_repository'; // Return the collection name for your entities
	}
	getTestCollection() {
		return this.getCollection();
	}
	wrapperMapQuerySnapshotToEntities(querySnapshot: FirebaseFirestore.QuerySnapshot) {
		return this.mapQuerySnapshotToEntities(querySnapshot);
	}
}
describe('FirestoreRepositoryImpl', () => {
	let repository: MyFirestoreRepositoryImpl;
	let testEntity: TestEntity;
	beforeEach(async () => {
		repository = new MyFirestoreRepositoryImpl();
		testEntity = { id: 'dummyId', name: 'dummyName', description: 'dummyDescription' };
		await repository.create(testEntity);
	});

	afterAll(async () => {
		await resetDB();
	});

	describe('mapQuerySnapshotToEntities', () => {
		it('should map a query snapshot to entities successfully', async () => {
			const querySnapshot = await repository.getTestCollection().get();
			const entities = repository.wrapperMapQuerySnapshotToEntities(querySnapshot);
			expect(entities.length).toBe(1);
			expect(entities[0]).toMatchObject(testEntity);
		});
	});
	describe('create', () => {
		it('should create wig list from organization successfully', async () => {
			const createTestEntity = new TestEntity('testId', 'testName', 'testDescription');
			const result = await repository.create(createTestEntity);
			expect(result.isRight()).toBe(true);
			const dbResult = await repository.find(createTestEntity.id);
			expect(dbResult.isRight()).toBe(true);
			expect(dbResult.extract()).toMatchObject(createTestEntity);
		});

		it('should create wig list from organization successfully from an entity without id', async () => {
			const allEntities = await repository.getTestCollection().get();
			const entityCount = allEntities.docs.length;
			const result = await repository.create({ name: 'test', description: 'test' });
			expect(result.isRight()).toBe(true);
			const allEntitiesAfter = await repository.getTestCollection().get();
			const entityCountAfter = allEntitiesAfter.docs.length;
			expect(entityCountAfter).toBe(entityCount + 1);
		});

		it('should return an error if something unexpected happens', async () => {
			const createTestEntity = new TestEntity('testId', 'testName', 'testDescription');
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.create(createTestEntity);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});
	describe('setFieldsToUndefined', () => {
		it('should successfully set specified fields to undefined', async () => {
			// Set a field to undefined
			await repository.setFieldsToUndefined(testEntity.id, ['name']);

			// Retrieve the updated entity to verify
			const result = await repository.find(testEntity.id);
			expect(result.isRight()).toBe(true);
			result.ifRight((data) => {
				expect(data).not.toHaveProperty('name');
				expect(data).toHaveProperty('description');
			});
		});
	});
	describe('find', () => {
		it('should return the document data for an existing document', async () => {
			// Assuming you have a setup function or beforeAll hook to insert test data
			const result = await repository.find(testEntity.id);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject(testEntity);
		});

		it('should return EntityNotExistsError for a non-existent document', async () => {
			const nonExistentId = 'non-existent-id';
			const result = await repository.find(nonExistentId);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.find('dummyOrganizationId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});
	describe('update', () => {
		it('should successfully update an existing document', async () => {
			const updateData = { name: 'Updated Name' };
			const expectedUpdatedEntity = { ...testEntity, ...updateData };
			const result = await repository.update(testEntity.id, updateData);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject(expectedUpdatedEntity);

			const dbResult = await repository.find(testEntity.id);
			expect(dbResult.isRight()).toBe(true);
			expect(dbResult.extract()).toMatchObject(expectedUpdatedEntity);
		});

		it('should return UnknownError for a non-existent document', async () => {
			const nonExistentDocId = 'non-existent-doc';
			const result = await repository.update(nonExistentDocId, { name: 'Should Fail' });
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});
	describe('write', () => {
		it('should successfully update an existing document', async () => {
			const updateData = { name: 'Updated Name' };
			const result = await repository.write(testEntity.id, updateData);
			expect(result.isRight()).toBe(true);

			const dbResult = await repository.find(testEntity.id);
			expect(dbResult.isRight()).toBe(true);
			expect(dbResult.extract()).toMatchObject({ ...testEntity, ...updateData });
		});

		it('should return UnknownError for a non-existent document', async () => {
			const nonExistentDocId = 'non-existent-doc';
			const result = await repository.write(nonExistentDocId, { name: 'Should Fail' });
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('delete', () => {
		it('should successfully delete an existing document', async () => {
			const documentToRemove = testEntity.id;
			const removeResult = await repository.delete(documentToRemove);
			expect(removeResult.isRight()).toBe(true);

			const result = await repository.find(documentToRemove);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should handle deletion of a non-existent document gracefully', async () => {
			const nonExistentDocId = 'non-existent-doc-for-deletion';
			const result = await repository.delete(nonExistentDocId);
			expect(result.isRight()).toBe(true);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.delete('dummyOrganizationId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});
});
