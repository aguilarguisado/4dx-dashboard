import { UpdateGeneralSection, UpdateGeneralSectionSchema } from '../../domain/types/UpdateGeneralSection';

import { z } from 'zod';

export const UpdateGeneralSectionSchemaDTOSchema = UpdateGeneralSectionSchema;

export type UpdateGeneralSectionDTO = z.infer<typeof UpdateGeneralSectionSchemaDTOSchema>;

export const toUpdateGeneralSectionModel = (dto: UpdateGeneralSectionDTO): UpdateGeneralSection => {
	return {
		id: dto.id,
		name: dto.name,
		description: dto.description,
		isOrganizational: dto.isOrganizational,
		dueDate: dto.dueDate,
	};
};
