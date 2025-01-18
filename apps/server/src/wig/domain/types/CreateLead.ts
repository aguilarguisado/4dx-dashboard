import { LeadMeasurementSchema } from './LeadMeasurement';

import { z } from 'zod';

export const CreateLeadSchema = LeadMeasurementSchema.omit({
	id: true,
});

export type CreateLead = z.infer<typeof CreateLeadSchema>;
