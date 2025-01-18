import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { DeleteWIGUseCase } from '../DeleteWIGUseCase';

import { Container } from 'inversify';
import { Right } from 'purify-ts';

describe('DeleteWIGUseCase', () => {
	let useCase: DeleteWIGUseCase;
	let container: Container;
	let mockWIGInteractor: {
		delete: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			delete: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(DeleteWIGUseCase);
	});

	it('successfully deletes the weig', async () => {
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.delete).toHaveBeenCalledWith(organizationId, wigId);
	});

	it('should return an error when failing to deleting the weig', async () => {
		vi.spyOn(mockWIGInteractor, 'delete').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.delete).toHaveBeenCalledWith(organizationId, wigId);
	});
});
