import { ScoreboardDTOSchema, toScoreboardModel } from './ScoreboardDTO';
import { LagMeasurement, LagMeasurementSchema } from '../../domain/types/LagMeasurement';

import { z } from 'zod';

export const UpdateLagDTOSchema = LagMeasurementSchema.omit({ scoreboard: true }).extend({
	wigId: z.string(),
	scoreboard: ScoreboardDTOSchema.optional(),
});

export type UpdateLagDTO = z.infer<typeof UpdateLagDTOSchema>;

export const toLagModel = (dto: UpdateLagDTO): LagMeasurement => {
	return {
		id: dto.id,
		title: dto.title,
		subtitle: dto.subtitle,
		scoreboard: dto.scoreboard ? toScoreboardModel(dto.scoreboard) : undefined,
	};
};
