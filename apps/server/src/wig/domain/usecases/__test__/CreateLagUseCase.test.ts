import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { SLAError } from '../../../../common/domain/exceptions/SLAError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { CreateLag } from '../../types/CreateLag';
import { CreateLagUseCase } from '../CreateLagUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

let createLagUseCase: CreateLagUseCase;
let container: Container;
let mockWIGInteractor: {
	getWIGFromOrganization: ReturnType<typeof vi.fn>;
	addLag: ReturnType<typeof vi.fn>;
};
let createLag: CreateLag;
let organizationId: string;
let wigId: string;

describe('CreateLagUseCase', () => {
	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		createLag = { title: 'lagName' };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			addLag: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		createLagUseCase = container.get(CreateLagUseCase);
	});

	it('should successfully create a lag', async () => {
		const result = await createLagUseCase.execute(organizationId, wigId, createLag);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLag).toHaveBeenCalled();
	});

	it('should return an error when failing to fetch WIG', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await createLagUseCase.execute(organizationId, wigId, createLag);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLag).not.toHaveBeenCalled();
	});

	it('should return an error when failing to add lag', async () => {
		vi.spyOn(mockWIGInteractor, 'addLag').mockResolvedValue(Left(new SLAError()));

		const result = await createLagUseCase.execute(organizationId, wigId, createLag);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(SLAError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLag).toHaveBeenCalled();
	});

	it('should return an error when an exception is thrown', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockRejectedValue(new Error());
		const result = await createLagUseCase.execute(organizationId, wigId, createLag);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLag).not.toHaveBeenCalled();
	});
});
