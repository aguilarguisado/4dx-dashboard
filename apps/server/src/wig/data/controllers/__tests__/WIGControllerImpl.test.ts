import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { BadRequestApiError } from '../../../../common/data/exceptions/BadRequestApiError';
import { InternalServerApiError } from '../../../../common/data/exceptions/InternalServerApiError';
import { IllegalStateError } from '../../../../common/domain/exceptions/IllegalStateError';
import { SLAError } from '../../../../common/domain/exceptions/SLAError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { mockWIG, mockWIGList } from '../../../domain/models/__mocks__/WIGMocks';
import { mockLag } from '../../../domain/types/__mocks__/LagMeasurementMocks';
import { mockLead } from '../../../domain/types/__mocks__/LeadMeasurementMocks';
import { CreateLagUseCase } from '../../../domain/usecases/CreateLagUseCase';
import { CreateLeadUseCase } from '../../../domain/usecases/CreateLeadUseCase';
import { CreateScoreboardUseCase } from '../../../domain/usecases/CreateScoreboardUseCase';
import { CreateWIGUseCase } from '../../../domain/usecases/CreateWIGUseCase';
import { DeleteLagUseCase } from '../../../domain/usecases/DeleteLagUseCase';
import { DeleteLeadUseCase } from '../../../domain/usecases/DeleteLeadUseCase';
import { DeleteScoreboardUseCase } from '../../../domain/usecases/DeleteScoreboardUseCase';
import { DeleteWIGUseCase } from '../../../domain/usecases/DeleteWIGUseCase';
import { GetWIGListUseCase } from '../../../domain/usecases/GetWIGListUseCase';
import { GetWIGUseCase } from '../../../domain/usecases/GetWIGUseCase';
import { UpdateLagUseCase } from '../../../domain/usecases/UpdateLagUseCase';
import { UpdateLeadUseCase } from '../../../domain/usecases/UpdateLeadUseCase';
import { UpdateScoreboardUseCase } from '../../../domain/usecases/UpdateScoreboardUseCase';
import { UpdateWIGUseCase } from '../../../domain/usecases/UpdateWIGUseCase';
import { mockCreateLagDTO, mockCreateLagDTOWithScoreboard } from '../../dtos/__mocks__/CreateLagDTOMocks';
import { mockCreateLeadDTO, mockCreateLeadDTOWithScoreboard } from '../../dtos/__mocks__/CreateLeadDTOMocks';
import { mockCreateWIGDTO } from '../../dtos/__mocks__/CreateWIGDTOMocks';
import { mockUpdateGeneralSectionDTO } from '../../dtos/__mocks__/UpdateGeneralSectionDTO';
import { mockUpdateLagDTO, mockUpdateLagDTOWithScoreboard } from '../../dtos/__mocks__/UpdateLagDTOMocks';
import { mockUpdateLeadDTO, mockUpdateLeadDTOWithScoreboard } from '../../dtos/__mocks__/UpdateLeadDTOMocks';
import { mockWIGScoreboardDTO } from '../../dtos/__mocks__/WIGScoreboardDTOMocks';
import { WIGControllerImpl } from '../WIGControllerImpl';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('WIGControllerImpl', () => {
	let container: Container;
	beforeEach(() => {
		container = resetTestAppContainer();
	});
	describe('getWIGs', () => {
		// Test case for successfully retrieving WIGs list
		it('should return a list of WIGs for an organization', async () => {
			const mockGetWIGListUseCase = { execute: vi.fn().mockResolvedValue(Right(mockWIGList)) };
			rebindMock(container, GetWIGListUseCase, mockGetWIGListUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);
			const result = await controller.getWIGs(mockOrganization.id);
			expect(result).toEqual(mockWIGList);
			expect(mockGetWIGListUseCase.execute).toHaveBeenCalledWith(mockOrganization.id);
		});

		// Test case for handling errors converted by genericApiErrorConverter
		it('should throw an error when getWIGListUseCase fails', async () => {
			const mockGetWIGListUseCase = { execute: vi.fn().mockResolvedValue(Left(new UnknownError())) };
			rebindMock(container, GetWIGListUseCase, mockGetWIGListUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.getWIGs(mockOrganization.id)).rejects.toThrow(InternalServerApiError);
			expect(mockGetWIGListUseCase.execute).toHaveBeenCalledWith(mockOrganization.id);
		});
	});
	describe('createWIG', () => {
		// Test case for successfully creating a WIG
		it('should successfully create a WIG for an organization', async () => {
			const expectedResponse = mockUpdateGeneralSectionDTO;
			const mockCreateWIGUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, CreateWIGUseCase, mockCreateWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.createWIG(mockOrganization.id, mockCreateWIGDTO);
			expect(result).toEqual(expectedResponse);
			expect(mockCreateWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, expect.anything());
		});

		// Test case for SLAError leading to BadRequestApiError
		it('should throw BadRequestApiError when SLA limit is reached', async () => {
			const mockCreateWIGUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new SLAError('SLAError'))),
			};
			rebindMock(container, CreateWIGUseCase, mockCreateWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.createWIG(mockOrganization.id, mockCreateWIGDTO)).rejects.toThrow(
				BadRequestApiError,
			);
			expect(mockCreateWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, expect.anything());
		});

		// Test case for handling unknown errors through genericApiErrorConverter
		it('should throw InternalServerApiError for unknown errors', async () => {
			const mockCreateWIGUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, CreateWIGUseCase, mockCreateWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.createWIG(mockOrganization.id, mockCreateWIGDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockCreateWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, expect.anything());
		});
	});
	describe('updateWIG', () => {
		// Test case for successfully updating a WIG
		it('should successfully update a WIG in an organization', async () => {
			const mockUpdateWIGUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, UpdateWIGUseCase, mockUpdateWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.updateWIG(mockOrganization.id, mockUpdateGeneralSectionDTO);
			expect(result).toEqual(undefined);
			expect(mockUpdateWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, expect.anything());
		});

		// Test case for handling errors with genericApiErrorConverter
		it('should throw an error when updateWIGUseCase fails', async () => {
			const mockUpdateWIGUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, UpdateWIGUseCase, mockUpdateWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.updateWIG(mockOrganization.id, mockUpdateGeneralSectionDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockUpdateWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, expect.anything());
		});
	});
	describe('deleteWIG', () => {
		// Test case for successfully deleting a WIG
		it('should successfully delete a WIG from an organization', async () => {
			const expectedResponse = {}; // Assuming delete doesn't return specific content
			const mockDeleteWIGUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, DeleteWIGUseCase, mockDeleteWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.deleteWIG(mockOrganization.id, mockWIG.id);
			expect(result).toEqual(expectedResponse);
			expect(mockDeleteWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id);
		});

		// Test case for handling errors with genericApiErrorConverter
		it('should throw an error when deleteWIGUseCase fails', async () => {
			const wigId = 'wigToDelete';
			const mockDeleteWIGUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, DeleteWIGUseCase, mockDeleteWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.deleteWIG(mockOrganization.id, wigId)).rejects.toThrow(InternalServerApiError);
			expect(mockDeleteWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, wigId);
		});
	});

	describe('getWIGFromOrganization', () => {
		// Test case for successfully retrieving a WIG by ID from an organization
		it('should return a specific WIG for an organization', async () => {
			const mockGetWIGUseCase = { execute: vi.fn().mockResolvedValue(Right(mockWIG)) };
			rebindMock(container, GetWIGUseCase, mockGetWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.getWIGFromOrganization(mockOrganization.id, mockWIG.id);
			expect(result).toEqual(mockWIG);
			expect(mockGetWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id);
		});

		// Test case for handling not found errors with a converted API error
		it('should throw an InternalServerApiError when the WIG cannot be found', async () => {
			const wigId = 'nonExistingWig';
			const mockGetWIGUseCase = { execute: vi.fn().mockResolvedValue(Left(new UnknownError())) };
			rebindMock(container, GetWIGUseCase, mockGetWIGUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.getWIGFromOrganization(mockOrganization.id, wigId)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockGetWIGUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, wigId);
		});
	});

	describe('addWIGLead', () => {
		// Test case for successfully adding a WIG lead
		it('should successfully add a lead to a WIG', async () => {
			const mockAddWIGLeadUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, CreateLeadUseCase, mockAddWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.addWIGLead(mockOrganization.id, mockCreateLeadDTO);
			expect(result).toEqual(undefined);
			expect(mockAddWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLeadDTO.wigId,
				expect.anything(),
			);
		});

		it('should successfully add a lead (with scoreboard) to a WIG', async () => {
			const mockAddWIGLeadUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, CreateLeadUseCase, mockAddWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.addWIGLead(mockOrganization.id, mockCreateLeadDTOWithScoreboard);
			expect(result).toEqual(undefined);
			expect(mockAddWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLeadDTOWithScoreboard.wigId,
				expect.anything(),
			);
		});

		it('should successfully add a lead (without scoreboardId) to a WIG', async () => {
			const leadToCreateDTO = { ...mockCreateLeadDTOWithScoreboard };
			if (leadToCreateDTO.scoreboard) {
				leadToCreateDTO.scoreboard.id = undefined;
			}
			const mockAddWIGLeadUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, CreateLeadUseCase, mockAddWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.addWIGLead(mockOrganization.id, leadToCreateDTO);
			expect(result).toEqual(undefined);
			expect(mockAddWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				leadToCreateDTO.wigId,
				expect.anything(),
			);
		});

		// Test case for SLAError leading to BadRequestApiError when adding a lead exceeds the limit
		it('should throw BadRequestApiError when SLA limit for leads is reached', async () => {
			const mockAddWIGLeadUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new SLAError('SLAError'))),
			};
			rebindMock(container, CreateLeadUseCase, mockAddWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.addWIGLead(mockOrganization.id, mockCreateLeadDTO)).rejects.toThrow(
				BadRequestApiError,
			);
			expect(mockAddWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLeadDTO.wigId,
				expect.anything(),
			);
		});

		it('should throw InternalServerApiError when UnknownError is got', async () => {
			const mockAddWIGLeadUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError('SLAError'))),
			};
			rebindMock(container, CreateLeadUseCase, mockAddWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.addWIGLead(mockOrganization.id, mockCreateLeadDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockAddWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLeadDTO.wigId,
				expect.anything(),
			);
		});
	});

	describe('updateWIGLead', () => {
		// Test case for successfully updating a WIG lead
		it('should successfully update a lead in a WIG', async () => {
			const mockUpdateWIGLeadUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, UpdateLeadUseCase, mockUpdateWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.updateWIGLead(mockOrganization.id, mockUpdateLeadDTO);
			expect(result).toEqual(undefined);
			expect(mockUpdateWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockUpdateLeadDTO.wigId,
				expect.anything(),
			);
		});

		it('should successfully update a lead (with scoreboard) in a WIG', async () => {
			const mockUpdateWIGLeadUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, UpdateLeadUseCase, mockUpdateWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.updateWIGLead(mockOrganization.id, mockUpdateLeadDTOWithScoreboard);
			expect(result).toEqual(undefined);
			expect(mockUpdateWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockUpdateLeadDTOWithScoreboard.wigId,
				expect.anything(),
			);
		});

		// Test case for handling errors with genericApiErrorConverter when update fails
		it('should throw an error when updateWIGLeadUseCase fails', async () => {
			const mockUpdateWIGLeadUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, UpdateLeadUseCase, mockUpdateWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.updateWIGLead(mockOrganization.id, mockUpdateLeadDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockUpdateWIGLeadUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockUpdateLeadDTO.wigId,
				expect.anything(),
			);
		});
	});
	describe('deleteWIGLead', () => {
		// Test case for successfully deleting a WIG lead
		it('should successfully delete a lead from a WIG', async () => {
			const mockDeleteWIGLeadUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, DeleteLeadUseCase, mockDeleteWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.deleteWIGLead(mockOrganization.id, mockWIG.id, mockLead.id);
			expect(result).toEqual(undefined);
			expect(mockDeleteWIGLeadUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id, mockLead.id);
		});

		// Test case for handling errors with genericApiErrorConverter when delete fails
		it('should throw an error when deleteWIGLeadUseCase fails', async () => {
			const mockDeleteWIGLeadUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, DeleteLeadUseCase, mockDeleteWIGLeadUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.deleteWIGLead(mockOrganization.id, mockWIG.id, mockLead.id)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockDeleteWIGLeadUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id, mockLead.id);
		});
	});
	describe('addWIGLag', () => {
		// Test case for successfully adding a WIG lag
		it('should successfully add a lag to a WIG', async () => {
			const mockCreateWIGLagUseCase = { execute: vi.fn().mockResolvedValue(Right(mockUpdateLagDTO)) };
			rebindMock(container, CreateLagUseCase, mockCreateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.addWIGLag(mockOrganization.id, mockCreateLagDTO);
			expect(result).toEqual(mockUpdateLagDTO);
			expect(mockCreateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLagDTO.wigId,
				expect.anything(),
			);
		});

		it('should successfully add a lag (with scoreboard) to a WIG', async () => {
			const mockCreateWIGLagUseCase = { execute: vi.fn().mockResolvedValue(Right(mockUpdateLagDTO)) };
			rebindMock(container, CreateLagUseCase, mockCreateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.addWIGLag(mockOrganization.id, mockCreateLagDTOWithScoreboard);
			expect(result).toEqual(mockUpdateLagDTO);
			expect(mockCreateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLagDTOWithScoreboard.wigId,
				expect.anything(),
			);
		});

		it('should successfully add a lag (without scoreboardId) to a WIG', async () => {
			const lagToCreateDTO = { ...mockCreateLagDTOWithScoreboard };
			if (lagToCreateDTO.scoreboard) {
				lagToCreateDTO.scoreboard.id = undefined;
			}
			const mockCreateWIGLagUseCase = { execute: vi.fn().mockResolvedValue(Right(mockUpdateLagDTO)) };
			rebindMock(container, CreateLagUseCase, mockCreateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.addWIGLag(mockOrganization.id, lagToCreateDTO);
			expect(result).toEqual(mockUpdateLagDTO);
			expect(mockCreateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				lagToCreateDTO.wigId,
				expect.anything(),
			);
		});

		// Test case for SLAError leading to BadRequestApiError when adding a lag exceeds the limit
		it('should throw BadRequestApiError when SLA limit for lags is reached', async () => {
			const mockCreateWIGLagUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new SLAError('SLAError'))),
			};
			rebindMock(container, CreateLagUseCase, mockCreateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.addWIGLag(mockOrganization.id, mockCreateLagDTO)).rejects.toThrow(
				BadRequestApiError,
			);
			expect(mockCreateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLagDTO.wigId,
				expect.anything(),
			);
		});

		it('should throw InternalServerApiError when UnknownError is got', async () => {
			const mockCreateWIGLagUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, CreateLagUseCase, mockCreateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.addWIGLag(mockOrganization.id, mockCreateLagDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockCreateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateLagDTO.wigId,
				expect.anything(),
			);
		});
	});
	describe('updateWIGLag', () => {
		// Test case for successfully updating a WIG lag
		it('should successfully update a lag in a WIG', async () => {
			const expectedResponse = {}; // Assuming update doesn't return the updated entity
			const mockUpdateWIGLagUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, UpdateLagUseCase, mockUpdateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.updateWIGLag(mockOrganization.id, mockUpdateLagDTO);
			expect(result).toEqual(expectedResponse);
			expect(mockUpdateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockUpdateLagDTO.wigId,
				expect.anything(),
			);
		});

		it('should successfully update a lag (with scoreboard) in a WIG', async () => {
			const expectedResponse = {}; // Assuming update doesn't return the updated entity
			const mockUpdateWIGLagUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, UpdateLagUseCase, mockUpdateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.updateWIGLag(mockOrganization.id, mockUpdateLagDTOWithScoreboard);
			expect(result).toEqual(expectedResponse);
			expect(mockUpdateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockUpdateLagDTOWithScoreboard.wigId,
				expect.anything(),
			);
		});

		// Test case for handling errors with genericApiErrorConverter when update fails
		it('should throw an error when updateWIGLagUseCase fails', async () => {
			const mockUpdateWIGLagUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, UpdateLagUseCase, mockUpdateWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.updateWIGLag(mockOrganization.id, mockUpdateLagDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockUpdateWIGLagUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockUpdateLagDTO.wigId,
				expect.anything(),
			);
		});
	});
	describe('deleteWIGLag', () => {
		// Test case for successfully deleting a WIG lag
		it('should successfully delete a lag from a WIG', async () => {
			const expectedResponse = {}; // Assuming delete doesn't return specific content
			const mockDeleteWIGLagUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, DeleteLagUseCase, mockDeleteWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.deleteWIGLag(mockOrganization.id, mockWIG.id, mockLag.id);
			expect(result).toEqual(expectedResponse);
			expect(mockDeleteWIGLagUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id, mockLag.id);
		});

		// Test case for handling errors with genericApiErrorConverter when delete fails
		it('should throw an error when deleteWIGLagUseCase fails', async () => {
			const mockDeleteWIGLagUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, DeleteLagUseCase, mockDeleteWIGLagUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.deleteWIGLag(mockOrganization.id, mockWIG.id, mockLag.id)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockDeleteWIGLagUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id, mockLag.id);
		});
	});
	describe('createScoreboard', () => {
		// Test case for successfully creating a WIG scoreboard
		it('should successfully create a scoreboard for a WIG', async () => {
			const mockCreateScoreboardUseCase = { execute: vi.fn().mockResolvedValue(Right(mockWIGScoreboardDTO)) };
			rebindMock(container, CreateScoreboardUseCase, mockCreateScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.createScoreboard(mockOrganization.id, mockWIGScoreboardDTO);
			expect(result).toEqual(mockWIGScoreboardDTO);
			expect(mockCreateScoreboardUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockWIGScoreboardDTO.wigId,
				expect.anything(),
			);
		});

		// Test case for handling specific business logic errors during scoreboard creation
		it('should throw BadRequestApiError for business logic violations', async () => {
			const mockCreateScoreboardUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new IllegalStateError('IllegalStateError'))),
			};
			rebindMock(container, CreateScoreboardUseCase, mockCreateScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.createScoreboard(mockOrganization.id, mockWIGScoreboardDTO)).rejects.toThrow(
				BadRequestApiError,
			);
			expect(mockCreateScoreboardUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockWIGScoreboardDTO.wigId,
				expect.anything(),
			);
		});

		it('should throw InternalServerApiError when UnknownError is got', async () => {
			const mockCreateScoreboardUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError('IllegalStateError'))),
			};
			rebindMock(container, CreateScoreboardUseCase, mockCreateScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.createScoreboard(mockOrganization.id, mockWIGScoreboardDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockCreateScoreboardUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockWIGScoreboardDTO.wigId,
				expect.anything(),
			);
		});
	});
	describe('updateScoreboard', () => {
		// Test case for successfully updating a WIG scoreboard
		it('should successfully update a scoreboard for a WIG', async () => {
			const expectedResponse = {}; // Assuming update doesn't return the updated entity
			const mockUpdateScoreboardUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, UpdateScoreboardUseCase, mockUpdateScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.updateScoreboard(mockOrganization.id, mockWIGScoreboardDTO);
			expect(result).toEqual(expectedResponse);
			expect(mockUpdateScoreboardUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockWIGScoreboardDTO.wigId,
				expect.anything(),
			);
		});

		// Test case for handling errors with genericApiErrorConverter when update fails
		it('should throw an error when updateScoreboardUseCase fails', async () => {
			const mockUpdateScoreboardUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, UpdateScoreboardUseCase, mockUpdateScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.updateScoreboard(mockOrganization.id, mockWIGScoreboardDTO)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockUpdateScoreboardUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockWIGScoreboardDTO.wigId,
				expect.anything(),
			);
		});
	});
	describe('deleteScoreboard', () => {
		// Test case for successfully deleting a WIG scoreboard
		it('should successfully delete a scoreboard from a WIG', async () => {
			const expectedResponse = {}; // Assuming delete doesn't return specific content
			const mockDeleteScoreboardUseCase = { execute: vi.fn().mockResolvedValue(Right(expectedResponse)) };
			rebindMock(container, DeleteScoreboardUseCase, mockDeleteScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			const result = await controller.deleteScoreboard(mockOrganization.id, mockWIG.id);
			expect(result).toEqual(expectedResponse);
			expect(mockDeleteScoreboardUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id);
		});

		// Test case for handling errors with genericApiErrorConverter when delete fails
		it('should throw an error when deleteScoreboardUseCase fails', async () => {
			const mockDeleteScoreboardUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, DeleteScoreboardUseCase, mockDeleteScoreboardUseCase);
			const controller: WIGControllerImpl = container.get(WIGControllerImpl);

			await expect(controller.deleteScoreboard(mockOrganization.id, mockWIG.id)).rejects.toThrow(
				InternalServerApiError,
			);
			expect(mockDeleteScoreboardUseCase.execute).toHaveBeenCalledWith(mockOrganization.id, mockWIG.id);
		});
	});
});
