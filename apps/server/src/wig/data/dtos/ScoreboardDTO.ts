import { Scoreboard, ScoreboardSchema } from '../../domain/types/Scoreboard';

import { v4 as uuid } from 'uuid';
import { z } from 'zod';

export const ScoreboardDTOSchema = ScoreboardSchema.pick({
	visualizationType: true,
	config: true,
}).extend({
	id: z.string().optional(),
});

export type ScoreboardDTO = z.infer<typeof ScoreboardDTOSchema>;

export const toScoreboardModel = (dto: ScoreboardDTO): Scoreboard => {
	return {
		id: dto.id ?? uuid(),
		visualizationType: dto.visualizationType,
		config: dto.config,
	};
};
