import { GeneralWIGInfoSchema } from '../models/WIG';

import { z } from 'zod';

export const UpdateGeneralSectionSchema = GeneralWIGInfoSchema.pick({
	id: true,
	name: true,
	description: true,
	isOrganizational: true,
	dueDate: true,
});

export type UpdateGeneralSection = z.infer<typeof UpdateGeneralSectionSchema>;
