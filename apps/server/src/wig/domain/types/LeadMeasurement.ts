import { ScoreboardSchema } from './Scoreboard';
import { buildZodI18N } from '../../../../../../packages/i18n/src';
import { IdModelSchema } from '../../../common/domain/models/BaseModel';

import { z } from 'zod';

export const MIN_NAME_LENGTH = 3;

export const LeadMeasurementSchema = IdModelSchema.extend({
	name: z
		.string()
		.min(MIN_NAME_LENGTH, { message: buildZodI18N('validation.error.min_length', { min: MIN_NAME_LENGTH }) }),
	scoreboard: ScoreboardSchema.optional(),
});
export type LeadMeasurement = z.infer<typeof LeadMeasurementSchema>;
