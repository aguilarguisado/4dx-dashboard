import { CreateOrganization, CreateOrganizationSchema } from '../../domain/models/Organization';

import { z } from 'zod';

export const CreateOrganizationDTOSchema = CreateOrganizationSchema.pick({ name: true });

export type CreateOrganizationDTO = z.infer<typeof CreateOrganizationDTOSchema>;

export const toCreateOrganizationModel = (dto: CreateOrganizationDTO): CreateOrganization => {
	return {
		name: dto.name,
	};
};
