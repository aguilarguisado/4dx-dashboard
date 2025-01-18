import { BaseModelSchema } from '../../../common/domain/models/BaseModel';

import { z } from 'zod';

export const OrganizationSchema = BaseModelSchema.extend({
	id: z.string(),
	name: z.string(),
	wigCount: z.number().default(0),
});

export const CreateOrganizationSchema = OrganizationSchema.omit({ id: true, wigCount: true });

export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
