import { LagMeasurementSchema } from './LagMeasurement';

import { z } from 'zod';

export const CreateLagSchema = LagMeasurementSchema.omit({
	id: true,
});

export type CreateLag = z.infer<typeof CreateLagSchema>;
