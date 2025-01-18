import { ScoreboardSchema } from './Scoreboard';
import { buildZodI18N } from '../../../../../../packages/i18n/src';
import { IdModelSchema } from '../../../common/domain/models/BaseModel';

import { z } from 'zod';

export const MIN_TITLE_LENGTH = 3;

export const LagMeasurementSchema = IdModelSchema.extend({
	title: z
		.string()
		.min(MIN_TITLE_LENGTH, { message: buildZodI18N('validation.error.min_length', { min: MIN_TITLE_LENGTH }) }),
	subtitle: z.string().optional(),
	scoreboard: ScoreboardSchema.optional(),
});
export type LagMeasurement = z.infer<typeof LagMeasurementSchema>;
