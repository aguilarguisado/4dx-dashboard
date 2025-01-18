import { CreateUser, CreateUserSchema } from '../../domain/models/AuthenticatedUser';

import { z } from 'zod';

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const toCreateUserModel = (dto: CreateUserDTO): CreateUser => {
	return {
		email: dto.email,
		displayName: dto.displayName,
		role: dto.role,
		password: dto.password,
		organizationId: dto.organizationId,
	};
};
