import { rebindMock, resetTestAppContainer } from '../../../__tests__/TestUtils';
import { UnauthorizedApiError } from '../../../common/data/exceptions/UnauthorizedApiError';
import {
	authenticatedMockUser,
	getNotLoggedUser,
	getOrdinaryUser,
	getSuperAdminUser,
} from '../../../lib/trpc/TestUtils';
import { appCreateCallerFactory } from '../../../lib/trpc/trpc';
import { AuthenticatedUser } from '../../domain/models/AuthenticatedUser';
import { AuthControllerImpl } from '../controllers/AuthControllerImpl';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { authRouter } from '../router';

import { Container } from 'inversify';

describe('authRouter', () => {
	let container: Container;
	let createUserDTO: CreateUserDTO;
	let authenticatedUser: AuthenticatedUser;
	beforeEach(() => {
		(createUserDTO = {
			email: 'test@test.com',
			displayName: 'test',
			password: 'Juanito123!',
			role: 'user',
			organizationId: 'org123',
		}),
			(authenticatedUser = authenticatedMockUser);
		container = resetTestAppContainer();
	});
	describe('createUser route', () => {
		it('should successfully create a user with a superadmin user', async () => {
			const mockController = { createUser: vi.fn().mockResolvedValue(authenticatedUser) };
			rebindMock(container, AuthControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(authRouter);
			const caller = createCaller(getSuperAdminUser());
			const result = await caller.createUser(createUserDTO);
			expect(result).toEqual(authenticatedUser);
		});

		it('should not create a user with an ordinary user', async () => {
			const mockController = { createUser: vi.fn() };
			rebindMock(container, AuthControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(authRouter);
			const caller = createCaller(getOrdinaryUser());
			await expect(caller.createUser(createUserDTO)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createUser).not.toHaveBeenCalledWith(createUserDTO);
		});

		it('should not create a user without a user in session', async () => {
			const mockController = { createUser: vi.fn() };
			rebindMock(container, AuthControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(authRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.createUser(createUserDTO)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createUser).not.toHaveBeenCalledWith(createUserDTO);
		});

		describe('createUser input validation', () => {
			beforeEach(() => {
				const mockController = { createUser: vi.fn() };
				rebindMock(container, AuthControllerImpl, mockController);
			});
			it('should reject when email is missing', async () => {
				const input = { ...createUserDTO, email: undefined } as unknown as CreateUserDTO;
				const createCaller = appCreateCallerFactory(authRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createUser(input)).rejects.toThrow();
			});

			it('should reject when email format is invalid', async () => {
				const input = { ...createUserDTO, email: 'invalidEmail' };
				const createCaller = appCreateCallerFactory(authRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createUser(input)).rejects.toThrow();
			});

			it('should reject when password is too weak', async () => {
				const input = { ...createUserDTO, password: 'weak' };
				const createCaller = appCreateCallerFactory(authRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createUser(input)).rejects.toThrow();
			});

			it('should reject when displayName is missing', async () => {
				const input = { ...createUserDTO, displayName: undefined } as unknown as CreateUserDTO;
				const createCaller = appCreateCallerFactory(authRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createUser(input)).rejects.toThrow();
			});

			it('should reject when organizationId is missing', async () => {
				const input = { ...createUserDTO, organizationId: undefined } as unknown as CreateUserDTO;
				const createCaller = appCreateCallerFactory(authRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(caller.createUser(input)).rejects.toThrow();
			});
		});
	});
});
