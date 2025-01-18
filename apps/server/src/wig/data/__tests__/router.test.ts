import { rebindMock, resetTestAppContainer } from '../../../__tests__/TestUtils';
import { UnauthorizedApiError } from '../../../common/data/exceptions/UnauthorizedApiError';
import { getNotLoggedUser, getOrdinaryUser, getSuperAdminUser } from '../../../lib/trpc/TestUtils';
import { appCreateCallerFactory } from '../../../lib/trpc/trpc';
import { WIG } from '../../domain/models/WIG';
import { WIGControllerImpl } from '../controllers/WIGControllerImpl';
import { CreateLagDTO } from '../dtos/CreateLagDTO';
import { CreateLeadDTO } from '../dtos/CreateLeadDTO';
import { CreateWIGDTO } from '../dtos/CreateWIGDTO';
import { DeleteLagDTO } from '../dtos/DeleteLagDTO';
import { DeleteLeadDTO } from '../dtos/DeleteLeadDTO';
import { UpdateGeneralSectionDTO } from '../dtos/UpdateGeneralSectionDTO';
import { UpdateLagDTO } from '../dtos/UpdateLagDTO';
import { UpdateLeadDTO } from '../dtos/UpdateLeadDTO';
import { WIGIdDTO } from '../dtos/WIGIdDTO';
import { WIGScoreboardDTO } from '../dtos/WIGScoreboardDTO';
import { wigRouter } from '../router';

import { Container } from 'inversify';

describe('wigRouter', () => {
	let container: Container;
	let mockWIG: WIG;
	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIG = { id: '1', name: 'testWIG', organizationId: '1', isOrganizational: false };
	});
	describe('getWIGs route', () => {
		it('should successfully get wig list for a superadmin user in a organization', async () => {
			const wigList = [{ id: '1', name: 'testWIG', organizationId: '1', isOrganizational: false }];
			const mockController = { getWIGs: vi.fn().mockResolvedValue(wigList) };
			rebindMock(container, WIGControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			const result = await caller.getWIGs();
			expect(result).toEqual(wigList);
		});

		it('should get wig list for an ordinary user in a organization', async () => {
			const wigList = [{ id: '1', name: 'testWIG', organizationId: '1', isOrganizational: false }];
			const mockController = { getWIGs: vi.fn().mockResolvedValue(wigList) };
			rebindMock(container, WIGControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			const result = await caller.getWIGs();
			expect(result).toEqual(wigList);
		});

		it('should not get wig list without a user in session', async () => {
			const wigList = [{ id: '1', name: 'testWIG', organizationId: '1', isOrganizational: false }];
			const mockController = { getWIGs: vi.fn().mockResolvedValue(wigList) };
			rebindMock(container, WIGControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.getWIGs()).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.getWIGs).not.toHaveBeenCalled();
		});
	});
	describe('getWIG route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let wig: WIG;
		beforeEach(() => {
			wig = { id: '1', name: 'testWIG', organizationId: '1', isOrganizational: false };
			mockController = { getWIGFromOrganization: vi.fn().mockResolvedValue(wig) };
			rebindMock(container, WIGControllerImpl, mockController);
		});
		it('should successfully get wig for a superadmin user in a organization', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			const result = await caller.getWIG({ id: '1' });
			expect(result).toEqual(wig);
		});

		it('should get wig for an ordinary user in a organization', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			const result = await caller.getWIG({ id: '1' });
			expect(result).toEqual(wig);
		});

		it('should not get wig without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.getWIG({ id: '1' })).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.getWIGFromOrganization).not.toHaveBeenCalled();
		});
		describe('getWIG input validation', () => {
			beforeEach(() => {
				const mockController = { getWIG: vi.fn() };
				rebindMock(container, WIGControllerImpl, mockController);
			});
			it('should reject when id is missing', async () => {
				const input = { id: undefined } as unknown as { id: string };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.getWIG(input)).rejects.toThrow();
				expect(mockController.getWIGFromOrganization).not.toHaveBeenCalled();
			});
		});
	});
	describe('createWIG route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let createWIGInput: CreateWIGDTO;
		beforeEach(() => {
			createWIGInput = {
				name: 'New WIG',
				description: 'A new WIG description',
				isOrganizational: true,
				dueDate: new Date('2023-01-01'),
			};
			mockController = { createWIG: vi.fn().mockResolvedValue({ id: '123' }) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully create a WIG for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.createWIG(createWIGInput);
			expect(mockController.createWIG).toHaveBeenCalledWith(expect.anything(), createWIGInput);
		});

		it('should allow an ordinary user to create a WIG', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.createWIG(createWIGInput);
			expect(mockController.createWIG).toHaveBeenCalledWith(expect.anything(), createWIGInput);
		});

		it('should not allow a WIG creation without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.createWIG(createWIGInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createWIG).not.toHaveBeenCalled();
		});

		describe('createWIG input validation', () => {
			it('should reject when name is missing', async () => {
				const input = { ...createWIGInput, name: undefined };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createWIG(input as unknown as CreateWIGDTO)).rejects.toThrow();
				expect(mockController.createWIG).not.toHaveBeenCalled();
			});

			it('should reject when name is too short', async () => {
				const input = { ...createWIGInput, name: 'Wi' }; // Assuming the minimum length is 3
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createWIG(input)).rejects.toThrow();
				expect(mockController.createWIG).not.toHaveBeenCalled();
			});

			it('should reject when isOrganizational is not a boolean', async () => {
				const input = { ...createWIGInput, isOrganizational: 'true' };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createWIG(input as unknown as CreateWIGDTO)).rejects.toThrow();
				expect(mockController.createWIG).not.toHaveBeenCalled();
			});

			it('should reject when dueDate is invalid', async () => {
				const input = { ...createWIGInput, dueDate: new Date('not-a-date') };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createWIG(input)).rejects.toThrow();
				expect(mockController.createWIG).not.toHaveBeenCalled();
			});
		});
	});
	describe('updateWIG route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let updateWIGInput: UpdateGeneralSectionDTO;
		beforeEach(() => {
			updateWIGInput = {
				id: '1',
				name: 'Updated WIG',
				description: 'An updated description',
				isOrganizational: true,
				dueDate: new Date('2023-12-31'),
			};
			mockController = { updateWIG: vi.fn().mockResolvedValue(undefined) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully update a WIG for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.updateWIG(updateWIGInput);
			expect(mockController.updateWIG).toHaveBeenCalledWith(expect.anything(), updateWIGInput);
		});

		it('should allow an ordinary user to update a WIG', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.updateWIG(updateWIGInput);
			expect(mockController.updateWIG).toHaveBeenCalledWith(expect.anything(), updateWIGInput);
		});

		it('should not allow WIG update without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.updateWIG(updateWIGInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.updateWIG).not.toHaveBeenCalled();
		});

		describe('updateWIG input validation', () => {
			it('should reject when id is missing', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());
				const updateInput = {
					name: 'Updated WIG',
					description: 'An updated description',
					isOrganizational: true,
					dueDate: new Date('2023-12-31'),
				};
				await expect(caller.updateWIG(updateInput as unknown as UpdateGeneralSectionDTO)).rejects.toThrow();
			});

			it('should reject when name is too short', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());
				const updateInput = {
					id: '1',
					name: 'Wi', // Assuming the minimum length is 3
					description: 'An updated description',
					isOrganizational: true,
					dueDate: new Date('2023-12-31'),
				};
				await expect(caller.updateWIG(updateInput)).rejects.toThrow();
			});

			it('should reject when isOrganizational is not a boolean', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());
				const updateInput = {
					id: '1',
					name: 'Updated WIG',
					description: 'An updated description',
					isOrganizational: 'true', // Should be a boolean, not a string
					dueDate: new Date('2023-12-31'),
				};
				await expect(caller.updateWIG(updateInput as unknown as UpdateGeneralSectionDTO)).rejects.toThrow();
			});

			it('should reject when dueDate is invalid', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());
				const updateInput = {
					id: '1',
					name: 'Updated WIG',
					description: 'An updated description',
					isOrganizational: true,
					dueDate: 'invalid-date', // Not a Date object
				};
				await expect(caller.updateWIG(updateInput as unknown as UpdateGeneralSectionDTO)).rejects.toThrow();
			});
		});
	});
	describe('deleteWIG route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let deleteWIGId: { id: string };
		beforeEach(() => {
			deleteWIGId = { id: '1' };
			mockController = { deleteWIG: vi.fn().mockResolvedValue(undefined) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully delete a WIG for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.deleteWIG(deleteWIGId);
			expect(mockController.deleteWIG).toHaveBeenCalledWith(expect.anything(), deleteWIGId.id);
		});

		it('should allow an ordinary user to delete a WIG', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.deleteWIG(deleteWIGId);
			expect(mockController.deleteWIG).toHaveBeenCalledWith(expect.anything(), deleteWIGId.id);
		});

		it('should not allow WIG deletion without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.deleteWIG(deleteWIGId)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.deleteWIG).not.toHaveBeenCalled();
		});

		describe('deleteWIG input validation', () => {
			it('should reject when id is missing', async () => {
				const input = { id: undefined };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.deleteWIG(input as unknown as { id: string })).rejects.toThrow();
				expect(mockController.deleteWIG).not.toHaveBeenCalled();
			});
		});
	});
	describe('addLead route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let createLeadInput: CreateLeadDTO;

		beforeEach(() => {
			createLeadInput = {
				name: 'New Lead',
				wigId: '1', // Assuming this is the WIG id to which the lead is added
			};
			const { name } = createLeadInput;
			mockController = { addWIGLead: vi.fn().mockResolvedValue({ id: '123', name }) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully add a lead for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.addLead(createLeadInput);
			expect(mockController.addWIGLead).toHaveBeenCalledWith(expect.anything(), createLeadInput);
		});

		it('should allow an ordinary user to add a lead', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.addLead(createLeadInput);
			expect(mockController.addWIGLead).toHaveBeenCalledWith(expect.anything(), createLeadInput);
		});

		it('should not allow lead addition without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.addLead(createLeadInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.addWIGLead).not.toHaveBeenCalled();
		});

		describe('addLead input validation', () => {
			it('should reject when name is too short', async () => {
				const input = { ...createLeadInput, name: 'Le' }; // Assuming the minimum length is 3
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.addLead(input)).rejects.toThrow();
				expect(mockController.addWIGLead).not.toHaveBeenCalled();
			});

			it('should reject when wigId is missing', async () => {
				const input = { ...createLeadInput, wigId: undefined };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.addLead(input as unknown as CreateLeadDTO)).rejects.toThrow();
				expect(mockController.addWIGLead).not.toHaveBeenCalled();
			});
		});
		describe('updateLead route', () => {
			let mockController: Partial<WIGControllerImpl>;
			let updateLeadInput: UpdateLeadDTO;

			beforeEach(() => {
				updateLeadInput = {
					id: '1',
					name: 'Updated Lead',
					wigId: '1', // Assuming this is the WIG id to which the lead belongs
				};
				const { id, name } = updateLeadInput;
				mockController = { updateWIGLead: vi.fn().mockResolvedValue({ id, name }) };
				rebindMock(container, WIGControllerImpl, mockController);
			});

			it('should successfully update a lead for a superadmin user', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());
				await caller.updateLead(updateLeadInput);
				expect(mockController.updateWIGLead).toHaveBeenCalledWith(expect.anything(), updateLeadInput);
			});

			it('should allow an ordinary user to update a lead', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getOrdinaryUser());
				await caller.updateLead(updateLeadInput);
				expect(mockController.updateWIGLead).toHaveBeenCalledWith(expect.anything(), updateLeadInput);
			});

			it('should not allow lead update without a user in session', async () => {
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getNotLoggedUser());
				await expect(caller.updateLead(updateLeadInput)).rejects.toThrow(UnauthorizedApiError);
				expect(mockController.updateWIGLead).not.toHaveBeenCalled();
			});

			describe('updateLead input validation', () => {
				it('should reject when name is too short', async () => {
					const input = { ...updateLeadInput, name: 'Le' }; // Assuming the minimum length is 3
					const createCaller = appCreateCallerFactory(wigRouter);
					const caller = createCaller(getSuperAdminUser());

					await expect(caller.updateLead(input)).rejects.toThrow();
					expect(mockController.updateWIGLead).not.toHaveBeenCalled();
				});

				it('should reject when id is missing', async () => {
					const input = { ...updateLeadInput, id: undefined };
					const createCaller = appCreateCallerFactory(wigRouter);
					const caller = createCaller(getSuperAdminUser());

					await expect(caller.updateLead(input as unknown as UpdateLeadDTO)).rejects.toThrow();
					expect(mockController.updateWIGLead).not.toHaveBeenCalled();
				});
			});
		});
	});
	describe('deleteLead route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let deleteLeadInput: DeleteLeadDTO;

		beforeEach(() => {
			deleteLeadInput = { id: '1', wigId: 'wig-1' };
			mockController = { deleteWIGLead: vi.fn().mockResolvedValue(undefined) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully delete a lead for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.deleteLead(deleteLeadInput);
			expect(mockController.deleteWIGLead).toHaveBeenCalledWith(expect.anything(), 'wig-1', '1');
		});

		it('should allow an ordinary user to delete a lead', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.deleteLead(deleteLeadInput);
			expect(mockController.deleteWIGLead).toHaveBeenCalledWith(expect.anything(), 'wig-1', '1');
		});

		it('should not allow lead deletion without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.deleteLead(deleteLeadInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.deleteWIGLead).not.toHaveBeenCalled();
		});
	});
	describe('createLag route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let createLagInput: CreateLagDTO;

		beforeEach(() => {
			createLagInput = {
				title: 'New Lag Measurement',
				subtitle: 'An optional subtitle',
				scoreboard: undefined, // Assuming this can be optional
				wigId: 'wig-1',
			};
			const { title, subtitle } = createLagInput;
			mockController = { addWIGLag: vi.fn().mockResolvedValue({ id: '123', title, subtitle }) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully create a lag for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.addLag(createLagInput);
			expect(mockController.addWIGLag).toHaveBeenCalledWith(expect.anything(), createLagInput);
		});

		it('should allow an ordinary user to create a lag', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.addLag(createLagInput);
			expect(mockController.addWIGLag).toHaveBeenCalledWith(expect.anything(), createLagInput);
		});

		it('should not allow lag creation without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.addLag(createLagInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.addWIGLag).not.toHaveBeenCalled();
		});

		describe('createLag input validation', () => {
			it('should reject when title is too short', async () => {
				const input = { ...createLagInput, title: 'La' }; // Assuming the minimum length is 3
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.addLag(input)).rejects.toThrow();
			});

			it('should reject when wigId is missing', async () => {
				const input = { ...createLagInput, wigId: undefined };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.addLag(input as unknown as CreateLagDTO)).rejects.toThrow();
			});
		});
	});
	describe('updateLag route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let updateLagInput: UpdateLagDTO;

		beforeEach(() => {
			updateLagInput = {
				id: '1',
				wigId: 'wig-1',
				title: 'Updated Lag Measurement',
				subtitle: 'An updated optional subtitle',
				scoreboard: undefined, // Assuming this can be optional
			};
			const { id, title, subtitle } = updateLagInput;
			mockController = { updateWIGLag: vi.fn().mockResolvedValue({ id, title, subtitle }) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully update a lag for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.updateLag(updateLagInput);
			expect(mockController.updateWIGLag).toHaveBeenCalledWith(expect.anything(), updateLagInput);
		});

		it('should allow an ordinary user to update a lag', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.updateLag(updateLagInput);
			expect(mockController.updateWIGLag).toHaveBeenCalledWith(expect.anything(), updateLagInput);
		});

		it('should not allow lag update without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.updateLag(updateLagInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.updateWIGLag).not.toHaveBeenCalled();
		});

		describe('updateLag input validation', () => {
			// Assuming similar validation criteria as for createLag
			it('should reject when title is too short', async () => {
				const input = { ...updateLagInput, title: 'La' }; // Assuming the minimum length is 3
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.updateLag(input)).rejects.toThrow();
			});
		});
	});
	describe('deleteLag route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let deleteLagInput: DeleteLagDTO;

		beforeEach(() => {
			deleteLagInput = { id: '1', wigId: 'wig-1' };
			mockController = { deleteWIGLag: vi.fn().mockResolvedValue(undefined) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully delete a lag for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.deleteLag(deleteLagInput);
			expect(mockController.deleteWIGLag).toHaveBeenCalledWith(expect.anything(), 'wig-1', '1');
		});

		it('should allow an ordinary user to delete a lag', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.deleteLag(deleteLagInput);
			expect(mockController.deleteWIGLag).toHaveBeenCalledWith(expect.anything(), 'wig-1', '1');
		});

		it('should not allow lag deletion without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.deleteLag(deleteLagInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.deleteWIGLag).not.toHaveBeenCalled();
		});
	});
	describe('createScoreboard route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let createScoreboardInput: WIGScoreboardDTO;

		beforeEach(() => {
			createScoreboardInput = {
				wigId: 'wig-1',
				visualizationType: 'progress',
				config: {
					current: 10,
					init: 0,
					target: 100,
					caption: 'Progress Caption',
					unit: '%',
				},
			};
			mockController = { createScoreboard: vi.fn().mockResolvedValue(mockWIG) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully create a scoreboard for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.createScoreboard(createScoreboardInput);
			expect(mockController.createScoreboard).toHaveBeenCalledWith(expect.anything(), createScoreboardInput);
		});

		it('should allow an ordinary user to create a scoreboard', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.createScoreboard(createScoreboardInput);
			expect(mockController.createScoreboard).toHaveBeenCalledWith(expect.anything(), createScoreboardInput);
		});

		it('should not allow scoreboard creation without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.createScoreboard(createScoreboardInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createScoreboard).not.toHaveBeenCalled();
		});

		describe('createScoreboard input validation', () => {
			// Assuming similar validation criteria as for createWIG
			it('should reject when init is not less than target', async () => {
				const input = { ...createScoreboardInput, config: { ...createScoreboardInput.config, init: 150 } };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createScoreboard(input)).rejects.toThrow();
			});
		});
	});
	describe('updateScoreboard route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let updateScoreboardInput: WIGScoreboardDTO;
		beforeEach(() => {
			updateScoreboardInput = {
				wigId: 'wig-1',
				visualizationType: 'progress',
				config: {
					current: 20,
					init: 0,
					target: 100,
					caption: 'Updated Progress Caption',
					unit: '%',
				},
			};
			mockController = { updateScoreboard: vi.fn().mockResolvedValue(mockWIG) };
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully update a scoreboard for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.updateScoreboard(updateScoreboardInput);
			expect(mockController.updateScoreboard).toHaveBeenCalledWith(expect.anything(), updateScoreboardInput);
		});

		it('should allow an ordinary user to update a scoreboard', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.updateScoreboard(updateScoreboardInput);
			expect(mockController.updateScoreboard).toHaveBeenCalledWith(expect.anything(), updateScoreboardInput);
		});

		it('should not allow scoreboard update without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.updateScoreboard(updateScoreboardInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.updateScoreboard).not.toHaveBeenCalled();
		});

		describe('updateScoreboard input validation', () => {
			// Similar to the createScoreboard validation tests
			it('should reject when init is not less than target in the config', async () => {
				const input = { ...updateScoreboardInput, config: { ...updateScoreboardInput.config, init: 150 } };
				const createCaller = appCreateCallerFactory(wigRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.updateScoreboard(input)).rejects.toThrow();
			});
		});
	});
	describe('deleteScoreboard route', () => {
		let mockController: Partial<WIGControllerImpl>;
		let deleteScoreboardInput: WIGIdDTO;

		beforeEach(() => {
			deleteScoreboardInput = { wigId: 'wig-1' };
			mockController = {
				deleteScoreboard: vi.fn().mockResolvedValue(undefined),
			};
			rebindMock(container, WIGControllerImpl, mockController);
		});

		it('should successfully delete a scoreboard for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getSuperAdminUser());
			await caller.deleteScoreboard(deleteScoreboardInput);
			expect(mockController.deleteScoreboard).toHaveBeenCalledWith(expect.anything(), 'wig-1');
		});

		it('should allow an ordinary user to delete a scoreboard', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getOrdinaryUser());
			await caller.deleteScoreboard(deleteScoreboardInput);
			expect(mockController.deleteScoreboard).toHaveBeenCalledWith(expect.anything(), 'wig-1');
		});

		it('should not allow scoreboard deletion without a user in session', async () => {
			const createCaller = appCreateCallerFactory(wigRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.deleteScoreboard(deleteScoreboardInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.deleteScoreboard).not.toHaveBeenCalled();
		});
	});
});
