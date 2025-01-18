import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { SLAError } from '../../../../common/domain/exceptions/SLAError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { CreateLead } from '../../types/CreateLead';
import { CreateLeadUseCase } from '../CreateLeadUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

let createLeadUseCase: CreateLeadUseCase;
let container: Container;
let mockWIGInteractor: {
	getWIGFromOrganization: ReturnType<typeof vi.fn>;
	addLead: ReturnType<typeof vi.fn>;
};
let createLead: CreateLead;
let organizationId: string;
let wigId: string;

describe('CreateLeadUseCase', () => {
	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		createLead = { name: 'leadName' };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			addLead: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		createLeadUseCase = container.get(CreateLeadUseCase);
	});

	it('should successfully create a lead', async () => {
		const result = await createLeadUseCase.execute(organizationId, wigId, createLead);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLead).toHaveBeenCalled();
	});

	it('should return an error when failing to fetch WIG', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await createLeadUseCase.execute(organizationId, wigId, createLead);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLead).not.toHaveBeenCalled();
	});

	it('should return an error when failing to add lead', async () => {
		vi.spyOn(mockWIGInteractor, 'addLead').mockResolvedValue(Left(new SLAError()));

		const result = await createLeadUseCase.execute(organizationId, wigId, createLead);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(SLAError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLead).toHaveBeenCalled();
	});

	it('should return an error when an exception is thrown', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockRejectedValue(new Error());
		const result = await createLeadUseCase.execute(organizationId, wigId, createLead);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.addLead).not.toHaveBeenCalled();
	});
});
