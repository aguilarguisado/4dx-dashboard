import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { GetWIGListUseCase } from '../GetWIGListUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('GetWIGListUseCase', () => {
	let useCase: GetWIGListUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGListFromOrganization: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;

	beforeAll(() => {
		organizationId = 'org123';
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGListFromOrganization: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(GetWIGListUseCase);
	});

	it('successfully gets the wig', async () => {
		const result = await useCase.execute(organizationId);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGListFromOrganization).toHaveBeenCalledWith(organizationId);
	});

	it('should return an error when failing entity does not exist', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGListFromOrganization').mockResolvedValue(Left(new UnknownError()));
		const result = await useCase.execute(organizationId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(UnknownError);
		expect(mockWIGInteractor.getWIGListFromOrganization).toHaveBeenCalledWith(organizationId);
	});

	it('should return an error when failing to getting the wig', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGListFromOrganization').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGListFromOrganization).toHaveBeenCalledWith(organizationId);
	});
});
