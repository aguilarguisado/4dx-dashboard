import { ScoreboardDTOSchema } from './ScoreboardDTO';
import { Scoreboard } from '../../domain/types/Scoreboard';

import { v4 as uuid } from 'uuid';
import { z } from 'zod';

export const WIGScoreboardDTOSchema = ScoreboardDTOSchema.extend({
	wigId: z.string(),
});

export type WIGScoreboardDTO = z.infer<typeof WIGScoreboardDTOSchema>;

export const toWIGScoreboardModel = (dto: WIGScoreboardDTO): Scoreboard => {
	return {
		id: dto.id ?? uuid(),
		visualizationType: dto.visualizationType,
		config: dto.config,
	};
};
