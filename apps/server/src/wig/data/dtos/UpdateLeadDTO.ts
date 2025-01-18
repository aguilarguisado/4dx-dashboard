import { ScoreboardDTOSchema, toScoreboardModel } from './ScoreboardDTO';
import { LeadMeasurement, LeadMeasurementSchema } from '../../domain/types/LeadMeasurement';

import { z } from 'zod';

export const UpdateLeadDTOSchema = LeadMeasurementSchema.omit({ scoreboard: true }).extend({
	wigId: z.string(),
	scoreboard: ScoreboardDTOSchema.optional(),
});

export type UpdateLeadDTO = z.infer<typeof UpdateLeadDTOSchema>;

export const toLeadModel = (dto: UpdateLeadDTO): LeadMeasurement => {
	return {
		id: dto.id,
		name: dto.name,
		scoreboard: dto.scoreboard ? toScoreboardModel(dto.scoreboard) : undefined,
	};
};
