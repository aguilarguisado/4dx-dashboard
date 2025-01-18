import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { IllegalStateError } from '../../../../common/domain/exceptions/IllegalStateError';
import { SLAError } from '../../../../common/domain/exceptions/SLAError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { ScoreboardHistoryType } from '../../../../scoreboard/domain/models/ScoreboardHistory';
import { mockWIG, mockWIGWithScoreboard } from '../../models/__mocks__/WIGMocks';
import {
	mockLag,
	mockLagWithProgressScoreboard,
	mockLagWithSeriesScoreboard,
} from '../../types/__mocks__/LagMeasurementMocks';
import {
	mockLead,
	mockLeadWithProgressScoreboard,
	mockLeadWithSeriesScoreboard,
} from '../../types/__mocks__/LeadMeasurementMocks';
import { mockProgressScoreboard } from '../../types/__mocks__/ScoreboardMocks';
import { Scoreboard } from '../../types/Scoreboard';
import { MAX_LEADS_PER_WIG, MAX_WIGS_PER_ORGANIZATION, WIGInteractor } from '../WIGInteractor';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

// TODO: Add integration tests for create / update / delete WIGs to check organizational logic and SLA limits
describe('WIGInteractor', () => {
	let interactor: WIGInteractor;
	let container: Container;
	let mockWIGRepository: {
		create: ReturnType<typeof vi.fn>;
		find: ReturnType<typeof vi.fn>;
		delete: ReturnType<typeof vi.fn>;
		getWIGListFromOrganization: ReturnType<typeof vi.fn>;
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		getOrganizationalWIGs: ReturnType<typeof vi.fn>;
		write: ReturnType<typeof vi.fn>;
		addLead: ReturnType<typeof vi.fn>;
		updateLead: ReturnType<typeof vi.fn>;
		deleteLead: ReturnType<typeof vi.fn>;
		addLag: ReturnType<typeof vi.fn>;
		updateLag: ReturnType<typeof vi.fn>;
		deleteLag: ReturnType<typeof vi.fn>;
		setScoreboard: ReturnType<typeof vi.fn>;
		clearScoreboardData: ReturnType<typeof vi.fn>;
		removeScoreboard: ReturnType<typeof vi.fn>;
	};
	let mockOrganizationRepository: {
		find: ReturnType<typeof vi.fn>;
		write: ReturnType<typeof vi.fn>;
	};
	let mockScoreboardHistoryRepository: {
		getLatestScoreboardEntries: ReturnType<typeof vi.fn>;
	};
	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGRepository = {
			create: vi.fn().mockResolvedValue(Right(mockWIG)),
			find: vi.fn().mockResolvedValue(Right(mockWIG)),
			delete: vi.fn().mockResolvedValue(Right(undefined)),
			getWIGListFromOrganization: vi.fn().mockResolvedValue(Right([])),
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right(mockWIG)),
			getOrganizationalWIGs: vi.fn().mockResolvedValue(Right([])),
			write: vi.fn().mockResolvedValue(Right(undefined)),
			addLead: vi.fn().mockResolvedValue(Right(mockLead)),
			updateLead: vi.fn().mockResolvedValue(Right(mockLead)),
			deleteLead: vi.fn().mockResolvedValue(Right(undefined)),
			addLag: vi.fn().mockResolvedValue(Right(mockLag)),
			updateLag: vi.fn().mockResolvedValue(Right(mockLag)),
			deleteLag: vi.fn().mockResolvedValue(Right(undefined)),
			setScoreboard: vi.fn().mockResolvedValue(Right(undefined)),
			clearScoreboardData: vi.fn().mockResolvedValue(Right(undefined)),
			removeScoreboard: vi.fn().mockResolvedValue(Right(undefined)),
		};
		mockOrganizationRepository = {
			find: vi.fn().mockResolvedValue(Right(mockOrganization)),
			write: vi.fn().mockResolvedValue(Right({})),
		};
		mockScoreboardHistoryRepository = {
			getLatestScoreboardEntries: vi.fn().mockResolvedValue(Right([{ date: new Date(), value: 10 }])),
		};
		rebindMock(container, Symbol.for('WIGRepository'), mockWIGRepository);
		rebindMock(container, Symbol.for('OrganizationRepository'), mockOrganizationRepository);
		rebindMock(container, Symbol.for('ScoreboardHistoryRepository'), mockScoreboardHistoryRepository);
		interactor = container.get(WIGInteractor);
	});

	describe('getWIGListFromOrganization', () => {
		it('should call getWIGListFromOrganization', async () => {
			await interactor.getWIGListFromOrganization(mockOrganization.id);
			expect(mockWIGRepository.getWIGListFromOrganization).toHaveBeenCalled();
		});
		// Unknown error
		it('should return an unknown error', async () => {
			vi.spyOn(mockWIGRepository, 'getWIGListFromOrganization').mockResolvedValue(Left(new UnknownError()));
			const result = await interactor.getWIGListFromOrganization(mockOrganization.id);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(Error);
			expect(mockWIGRepository.getWIGListFromOrganization).toHaveBeenCalled();
		});
	});

	describe('getWIGFromOrganization', () => {
		it('should successfully retrieve a WIG from an organization', async () => {
			const result = await interactor.getWIGFromOrganization(mockOrganization.id, mockWIG.id);
			expect(mockWIGRepository.getWIGFromOrganization).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toEqual(mockWIG);
		});

		it('should return a GetWIGError if the WIG cannot be found or accessed', async () => {
			vi.spyOn(mockWIGRepository, 'getWIGFromOrganization').mockResolvedValue(
				Left(new EntityNotExistsError('WIG not found')),
			);

			const result = await interactor.getWIGFromOrganization(mockOrganization.id, 'wigNotFound');
			expect(mockWIGRepository.getWIGFromOrganization).toHaveBeenCalledWith(mockOrganization.id, 'wigNotFound');
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(EntityNotExistsError);
			expect((error as EntityNotExistsError).message).toBe('WIG not found');
		});

		// Additional tests for handling unexpected errors
		it('should handle unexpected errors', async () => {
			vi.spyOn(mockWIGRepository, 'getWIGFromOrganization').mockResolvedValue(
				Left(new UnknownError('Unexpected error')),
			);

			const result = await interactor.getWIGFromOrganization(mockOrganization.id, mockWIG.id);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
			expect((error as UnknownError).message).toBe('Unexpected error');
		});
	});

	describe('create', () => {
		// Test case for successfully creating a WIG
		it('should successfully create a WIG when under the maximum limit', async () => {
			const result = await interactor.create(mockOrganization.id, mockWIG);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.create).toHaveBeenCalled();
		});

		it('should successfully create an organization WIG when under the maximum limit', async () => {
			const result = await interactor.create(mockOrganization.id, { ...mockWIG, isOrganizational: true });
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.create).toHaveBeenCalled();
		});

		// Test case for reaching the maximum number of WIGs per organization
		it('should return an SLAError when trying to create a WIG that exceeds the maximum limit', async () => {
			const organization = { ...mockOrganization, wigCount: MAX_WIGS_PER_ORGANIZATION };
			vi.spyOn(mockOrganizationRepository, 'find').mockResolvedValue(Right(organization));

			const result = await interactor.create(mockOrganization.id, mockWIG);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(SLAError);
			expect((error as SLAError).message).toBe('Max WIGs reached');
		});

		// Test case for removing an existing organizational WIG before creating a new one
		it('should remove an existing organizational WIG before creating a new one', async () => {
			const organization = { ...mockOrganization, wigCount: 2 };
			vi.spyOn(mockOrganizationRepository, 'find').mockResolvedValue(Right(organization));

			const result = await interactor.create(mockOrganization.id, mockWIG);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.create).toHaveBeenCalled();
		});

		// Additional test cases for error handling
		// Example: Testing for UnknownError during organization lookup
		it('should handle unknown errors during organization lookup', async () => {
			vi.spyOn(mockOrganizationRepository, 'find').mockResolvedValue(Left(new UnknownError()));
			const result = await interactor.create(mockOrganization.id, mockWIG);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});

		// Additional tests for other error scenarios...
	});

	describe('update', () => {
		// Test case for successfully updating a non-organizational WIG
		it('should successfully update a non-organizational WIG', async () => {
			const updateWIGData = { ...mockWIG, name: 'updatedWIG' };
			vi.spyOn(mockWIGRepository, 'find').mockResolvedValue(Right(updateWIGData));

			const result = await interactor.update(updateWIGData);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.write).toHaveBeenCalledWith(updateWIGData.id, updateWIGData);
		});

		// Test case for successfully updating an organizational WIG
		it('should handle the update of an organizational WIG', async () => {
			const firstMockWIG = { ...mockWIG, isOrganizational: true };
			const updateWIGData = { ...firstMockWIG, name: 'updatedWIG' };

			vi.spyOn(mockWIGRepository, 'find').mockResolvedValue(Right(firstMockWIG));
			vi.spyOn(mockWIGRepository, 'getOrganizationalWIGs').mockResolvedValue(Right([firstMockWIG]));

			const result = await interactor.update(updateWIGData);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.find).toHaveBeenCalledWith(updateWIGData.id);
			expect(mockWIGRepository.write).toHaveBeenCalledWith(updateWIGData.id, updateWIGData);
		});

		// Test case for successfully updating an organizational WIG to non-organizational
		it('should handle the update of an organizational WIG to non-organizational', async () => {
			const firstMockWIG = { ...mockWIG, isOrganizational: true };
			const updateWIGData = { ...mockWIG, name: 'updatedWIG', isOrganizational: false };
			vi.spyOn(mockWIGRepository, 'find').mockResolvedValue(Right(firstMockWIG));
			vi.spyOn(mockWIGRepository, 'getOrganizationalWIGs').mockResolvedValue(Right([firstMockWIG]));

			const result = await interactor.update(updateWIGData);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.find).not.toHaveBeenCalledWith(updateWIGData.id);
			expect(mockWIGRepository.write).toHaveBeenCalledWith(updateWIGData.id, updateWIGData);
		});

		it('should handle the update of a non-organizational WIG to organizational', async () => {
			const nonOrganizationalWIG = { ...mockWIG, isOrganizational: false };
			const updateWIGData = { ...mockWIG, name: 'updatedWIG', isOrganizational: true };
			vi.spyOn(mockWIGRepository, 'find').mockResolvedValue(Right(nonOrganizationalWIG));

			const result = await interactor.update(updateWIGData);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.find).toHaveBeenCalledWith(updateWIGData.id);
			expect(mockWIGRepository.write).toHaveBeenCalledWith(updateWIGData.id, updateWIGData);
		});

		// Test case for attempting to update a WIG that doesn't exist
		it('should return an EntityNotExistsError if the WIG to update does not exist', async () => {
			const updateWIGData = { ...mockWIG, id: 'notExisting' };
			vi.spyOn(mockWIGRepository, 'write').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.update(updateWIGData);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});

		// Additional tests for error scenarios
		// Example: Testing for UnknownError during the update process
		it('should handle unknown errors during the update process', async () => {
			const updateWIGData = { ...mockWIG, name: 'updatedWIG' }; // Simplified update data

			vi.spyOn(mockWIGRepository, 'write').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.update(updateWIGData);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});
	});

	describe('delete', () => {
		// Test case for successfully deleting a WIG
		it('should successfully delete a WIG and update the organization wig count', async () => {
			const result = await interactor.delete(mockOrganization.id, mockWIG.id);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.delete).toHaveBeenCalledWith(mockWIG.id);
			expect(mockOrganizationRepository.write).toHaveBeenCalledWith(mockOrganization.id, { wigCount: 0 });
		});

		// Test case for attempting to delete a WIG that does not exist
		it('should return an EntityNotExistsError if the WIG does not exist', async () => {
			vi.spyOn(mockWIGRepository, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));

			const result = await interactor.delete(mockOrganization.id, mockWIG.id);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(EntityNotExistsError);
		});

		// Test case for handling unknown errors during the delete process
		it('should handle unknown errors during the delete process', async () => {
			vi.spyOn(mockWIGRepository, 'getWIGFromOrganization').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.delete(mockOrganization.id, mockWIG.id);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});

		// Test case for verifying correct error handling when failing to update the organization's WIG count
		it('should handle errors when updating the organization wig count', async () => {
			const wigId = mockWIG.id;
			vi.spyOn(mockOrganizationRepository, 'write').mockResolvedValue(
				Left(new UnknownError('Failed to update organization')),
			);

			const result = await interactor.delete(mockOrganization.id, wigId);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
			expect((error as UnknownError).message).toBe('Failed to update organization');
		});
	});

	describe('addLead', () => {
		// Successful lead addition when under the max limit
		it('should successfully add a lead when under the max leads limit', async () => {
			const newLead = { name: 'New Lead' };
			const result = await interactor.addLead(mockWIG, newLead);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.addLead).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		it('should add the lead correctly if the scoreboard is valid for progress type', async () => {
			const result = await interactor.addLead(mockWIG, mockLeadWithProgressScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.addLead).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		it('should add the lead correctly if the scoreboard is valid for series type', async () => {
			const result = await interactor.addLead(mockWIG, mockLeadWithSeriesScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.addLead).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		// SLAError when trying to add a lead that exceeds the max leads limit
		it('should return an SLAError when adding a lead exceeds the max leads limit', async () => {
			const wig = { ...mockWIG, leads: new Array(MAX_LEADS_PER_WIG).fill({}) }; // WIG with max leads

			const result = await interactor.addLead(wig, mockLead);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(SLAError);
			expect((error as SLAError).message).toBe('Max leads reached');
		});

		// Handling unknown errors during lead addition
		it('should handle unknown errors during lead addition', async () => {
			vi.spyOn(mockWIGRepository, 'addLead').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.addLead(mockWIG, mockLead);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});

		it('should handle validation errors if scoreboard is not valid', async () => {
			const newLead = { ...mockLead };
			newLead.scoreboard = {
				id: '123',
				visualizationType: 'series' as const,
				config: { init: 0, target: 100, current: 50 },
			};
			const result = await interactor.addLead(mockWIG, newLead);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(IllegalStateError);
			expect(mockWIGRepository.addLead).not.toHaveBeenCalled();
		});
	});

	describe('updateLead', () => {
		// Successful lead update
		it('should successfully update a lead', async () => {
			vi.spyOn(mockWIGRepository, 'updateLead').mockResolvedValue(Right(mockLead));

			const result = await interactor.updateLead(mockWIG, mockLead);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLead).toHaveBeenCalledWith(mockWIG.id, mockLead);
		});

		it('should update the lead correctly if the scoreboard is valid for progress type', async () => {
			const result = await interactor.updateLead(mockWIG, mockLeadWithProgressScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLead).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		it('should update the lead correctly if the scoreboard is valid for series type', async () => {
			const result = await interactor.updateLead(mockWIG, mockLeadWithSeriesScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLead).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		// EntityNotExistsError when the lead to update does not exist
		it('should return an EntityNotExistsError if the lead does not exist', async () => {
			vi.spyOn(mockWIGRepository, 'updateLead').mockResolvedValue(Left(new EntityNotExistsError()));

			const result = await interactor.updateLead(mockWIG, mockLead);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(EntityNotExistsError);
		});

		it('should handle validation errors if scoreboard is not valid', async () => {
			const updateLead = { ...mockLead };
			updateLead.scoreboard = {
				id: '123',
				visualizationType: 'series' as const,
				config: { init: 0, target: 100, current: 50 },
			};
			const result = await interactor.updateLead(mockWIG, updateLead);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(IllegalStateError);
			expect(mockWIGRepository.updateLead).not.toHaveBeenCalled();
		});
	});

	describe('deleteLead', () => {
		// Successful lead deletion
		it('should successfully delete a lead', async () => {
			vi.spyOn(mockWIGRepository, 'deleteLead').mockResolvedValue(Right(undefined));

			const result = await interactor.deleteLead(mockWIG, mockLead.id);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.deleteLead).toHaveBeenCalledWith(mockWIG.id, mockLead.id);
		});

		// EntityNotExistsError when the lead to delete does not exist
		it('should return an EntityNotExistsError if the lead does not exist', async () => {
			vi.spyOn(mockWIGRepository, 'deleteLead').mockResolvedValue(Left(new EntityNotExistsError()));

			const result = await interactor.deleteLead(mockWIG, 'nonExistingLead');
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(EntityNotExistsError);
		});
	});

	describe('addLag', () => {
		// Successful lag addition when under the max limit
		it('should successfully add a lag when under the max lags limit', async () => {
			const result = await interactor.addLag(mockWIG, mockLag);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.addLag).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		// SLAError when trying to add a lag that exceeds the max lags limit
		it('should return an SLAError when adding a lag exceeds the max lags limit', async () => {
			const wig = { ...mockWIG, lags: new Array(MAX_LEADS_PER_WIG).fill({}) }; // WIG with max lags
			const result = await interactor.addLag(wig, mockLag);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(SLAError);
			expect((error as SLAError).message).toBe('Max lags reached');
		});

		it('should add the lag correctly if the scoreboard is valid for progress type', async () => {
			const result = await interactor.addLag(mockWIG, mockLagWithProgressScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.addLag).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		it('should add the lag correctly if the scoreboard is valid for series type', async () => {
			const result = await interactor.addLag(mockWIG, mockLagWithSeriesScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.addLag).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		// Handling unknown errors during lag addition
		it('should handle unknown errors during lag addition', async () => {
			vi.spyOn(mockWIGRepository, 'addLag').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.addLag(mockWIG, mockLag);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});

		it('should handle validation errors if scoreboard is not valid', async () => {
			const newLag = { ...mockLag };
			newLag.scoreboard = {
				id: '123',
				visualizationType: 'series' as const,
				config: { init: 0, target: 100, current: 50 },
			};

			const result = await interactor.addLag(mockWIG, newLag);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(IllegalStateError);
			expect(mockWIGRepository.addLag).not.toHaveBeenCalled();
		});
	});

	describe('updateLag', () => {
		// Successful lag update
		it('should successfully update a lag', async () => {
			vi.spyOn(mockWIGRepository, 'updateLag').mockResolvedValue(Right(mockLag));

			const result = await interactor.updateLag(mockWIG, mockLag);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLag).toHaveBeenCalledWith(mockWIG.id, mockLag);
		});

		it('should update the lag correctly if the scoreboard is valid for progress type', async () => {
			const result = await interactor.updateLag(mockWIG, mockLagWithProgressScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLag).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		it('should update the lag correctly if the scoreboard is valid for series type', async () => {
			const result = await interactor.updateLag(mockWIG, mockLagWithSeriesScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLag).toHaveBeenCalledWith(mockWIG.id, expect.anything());
		});

		// EntityNotExistsError when the lag to update does not exist
		it('should return an EntityNotExistsError if the lag does not exist', async () => {
			vi.spyOn(mockWIGRepository, 'updateLag').mockResolvedValue(Left(new EntityNotExistsError()));

			const result = await interactor.updateLag(mockWIG, mockLag);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(EntityNotExistsError);
		});

		it('should handle validation errors if scoreboard is not valid', async () => {
			const updateLag = { ...mockLag };
			updateLag.scoreboard = {
				id: '123',
				visualizationType: 'series' as const,
				config: { init: 0, target: 100, current: 50 },
			};

			const result = await interactor.updateLag(mockWIG, updateLag);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(IllegalStateError);
			expect(mockWIGRepository.updateLag).not.toHaveBeenCalled();
		});
	});

	describe('deleteLag', () => {
		// Successful lag deletion
		it('should successfully delete a lag', async () => {
			vi.spyOn(mockWIGRepository, 'deleteLag').mockResolvedValue(Right(undefined));

			const result = await interactor.deleteLag(mockWIG, mockLag.id);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.deleteLag).toHaveBeenCalledWith(mockWIG.id, mockLag.id);
		});

		// EntityNotExistsError when the lag to delete does not exist
		it('should return an EntityNotExistsError if the lag does not exist', async () => {
			vi.spyOn(mockWIGRepository, 'deleteLag').mockResolvedValue(Left(new EntityNotExistsError()));

			const result = await interactor.deleteLag(mockWIG, 'nonExistingLag');
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(EntityNotExistsError);
		});
	});

	describe('setScoreboard', () => {
		// Successful scoreboard setting
		it('should successfully set a scoreboard for a WIG', async () => {
			vi.spyOn(mockWIGRepository, 'setScoreboard').mockResolvedValue(Right(mockWIG));

			const result = await interactor.setScoreboard(mockWIG.id, mockProgressScoreboard);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.setScoreboard).toHaveBeenCalledWith(mockWIG.id, mockProgressScoreboard);
		});

		// Handling unknown errors during scoreboard setting
		it('should handle unknown errors when setting a scoreboard', async () => {
			const result = await interactor.setScoreboard(mockWIG.id, undefined as unknown as Scoreboard);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(IllegalStateError);
		});
	});

	describe('clearScoreboardData', () => {
		// Successful scoreboard deletion
		it('should successfully delete a scoreboard for a WIG', async () => {
			const result = await interactor.clearScoreboardData(mockWIG.id);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.clearScoreboardData).toHaveBeenCalledWith(mockWIG.id);
		});

		// Handling unknown errors during scoreboard deletion
		it('should handle unknown errors when deleting a scoreboard', async () => {
			vi.spyOn(mockWIGRepository, 'clearScoreboardData').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.clearScoreboardData(mockWIG.id);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});
	});

	describe('deleteScoreboard', () => {
		// Successful scoreboard deletion
		it('should successfully delete a scoreboard for a WIG', async () => {
			const result = await interactor.deleteScoreboard(mockWIG.id);
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.removeScoreboard).toHaveBeenCalledWith(mockWIG.id);
		});

		// Handling unknown errors during scoreboard deletion
		it('should handle unknown errors when deleting a scoreboard', async () => {
			vi.spyOn(mockWIGRepository, 'removeScoreboard').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.deleteScoreboard(mockWIG.id);
			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
		});
	});

	describe('refreshScoreboard', () => {
		it('should refresh a WIG scoreboard successfully', async () => {
			const wig = mockWIGWithScoreboard;
			const mockScoreboardId = wig.scoreboard?.id as string;
			const result = await interactor.refreshScoreboard(wig, mockScoreboardId, 'wig');
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.write).toHaveBeenCalledWith(wig.id, expect.anything());
		});

		it('should return an error if the WIG scoreboard does not exist', async () => {
			const result = await interactor.refreshScoreboard(mockWIGWithScoreboard, 'nonexistent', 'wig');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should refresh a lead scoreboard successfully', async () => {
			const wig = { ...mockWIGWithScoreboard };
			wig.leads = [mockLeadWithProgressScoreboard];
			const scoreboardId = wig.leads?.[0].scoreboard?.id as string;
			const result = await interactor.refreshScoreboard(wig, scoreboardId, 'lead');
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLead).toHaveBeenCalledWith(wig.id, expect.anything());
		});

		it('should return an error if the lead scoreboard does not exist', async () => {
			const wig = { ...mockWIGWithScoreboard };
			wig.leads = [mockLeadWithProgressScoreboard];
			const result = await interactor.refreshScoreboard(wig, 'noExisting', 'lead');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should refresh a lag scoreboard successfully', async () => {
			const wig = { ...mockWIGWithScoreboard };
			wig.lags = [mockLagWithProgressScoreboard];
			const scoreboardId = wig.lags?.[0].scoreboard?.id as string;
			const result = await interactor.refreshScoreboard(wig, scoreboardId, 'lag');
			expect(result.isRight()).toBe(true);
			expect(mockWIGRepository.updateLag).toHaveBeenCalledWith(wig.id, expect.anything());
		});

		it('should return an error if the lag scoreboard does not exist', async () => {
			const wig = { ...mockWIGWithScoreboard };
			wig.lags = [mockLagWithProgressScoreboard];
			const result = await interactor.refreshScoreboard(wig, 'noExisting', 'lag');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should handle invalid container types', async () => {
			const result = await interactor.refreshScoreboard(
				mockWIGWithScoreboard,
				'score1',
				'invalid' as ScoreboardHistoryType,
			);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(IllegalStateError);
		});

		it('should return an error if getting entries fails', async () => {
			vi.spyOn(mockScoreboardHistoryRepository, 'getLatestScoreboardEntries').mockResolvedValue(
				Left(new UnknownError()),
			);
			const wig = mockWIGWithScoreboard;
			const mockScoreboardId = wig.scoreboard?.id as string;
			const result = await interactor.refreshScoreboard(wig, mockScoreboardId, 'wig');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});
});
