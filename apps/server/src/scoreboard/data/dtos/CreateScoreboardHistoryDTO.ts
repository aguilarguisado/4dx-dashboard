import { ScoreboardHistorySchema } from '../../domain/models/ScoreboardHistory';
import { CreateScoreboardHistory } from '../../domain/types/CreateScoreboardHistory';

import { z } from 'zod';

export const CreateScoreboardHistoryDTOSchema = ScoreboardHistorySchema.omit({
	id: true,
	organizationId: true,
});

export type CreateScoreboardHistoryDTO = z.infer<typeof CreateScoreboardHistoryDTOSchema>;

export const toCreateScoreboardHistoryModel = (dto: CreateScoreboardHistoryDTO): CreateScoreboardHistory => {
	return {
		wigId: dto.wigId,
		containerId: dto.containerId,
		scoreboardId: dto.scoreboardId,
		containerType: dto.containerType,
		date: dto.date,
		value: dto.value,
		comment: dto.comment,
	};
};
