import { BaseModelSchema } from '../../../common/domain/models/BaseModel';
import { LagMeasurementSchema } from '../types/LagMeasurement';
import { LeadMeasurementSchema } from '../types/LeadMeasurement';
import { ScoreboardSchema } from '../types/Scoreboard';

import { buildZodI18N } from 'i18n';
import { z } from 'zod';

export const MIN_NAME_LENGTH = 3;

export const WIGSchema = BaseModelSchema.extend({
	organizationId: z.string(),
	name: z
		.string()
		.min(MIN_NAME_LENGTH, { message: buildZodI18N('validation.error.min_length', { min: MIN_NAME_LENGTH }) }),
	description: z.string().optional(),
	isOrganizational: z.boolean().default(false),
	dueDate: z.date().optional(),
	scoreboard: ScoreboardSchema.optional(),
	leads: z.array(LeadMeasurementSchema).max(2).optional(),
	lags: z.array(LagMeasurementSchema).max(2).optional(),
});

export const GeneralWIGInfoSchema = BaseModelSchema.extend(
	WIGSchema.pick({
		id: true,
		name: true,
		description: true,
		isOrganizational: true,
		dueDate: true,
	}).shape,
);

export type WIG = z.infer<typeof WIGSchema>;
export type GeneralWIGInfo = z.infer<typeof GeneralWIGInfoSchema>;
