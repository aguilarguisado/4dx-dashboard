import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { NotPermissionError } from '../../../../common/domain/exceptions/NotPermissionError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { GetWIGUseCase } from '../GetWIGUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('GetWIGUseCase', () => {
	let useCase: GetWIGUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
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
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(GetWIGUseCase);
	});

	it('successfully gets the wig', async () => {
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
	});

	it('should return an error when failing entity does not exist', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new NotPermissionError()));
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(NotPermissionError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
	});

	it('should return an error when failing to getting the wig', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
	});
});
