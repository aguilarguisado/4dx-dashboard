import { WIGSchema } from '../models/WIG';

import { z } from 'zod';

export const CreateWIGSchema = WIGSchema.pick({
	name: true,
	description: true,
	isOrganizational: true,
	dueDate: true,
});

export type CreateWIG = z.infer<typeof CreateWIGSchema>;
