import { toScoreboardModel } from './ScoreboardDTO';
import { UpdateLagDTOSchema } from './UpdateLagDTO';
import { CreateLag } from '../../domain/types/CreateLag';

import { z } from 'zod';

export const CreateLagDTOSchema = UpdateLagDTOSchema.omit({
	id: true,
});

export type CreateLagDTO = z.infer<typeof CreateLagDTOSchema>;

export const toCreateLagModel = (dto: CreateLagDTO): CreateLag => {
	return {
		title: dto.title,
		subtitle: dto.subtitle,
		scoreboard: dto.scoreboard ? toScoreboardModel(dto.scoreboard) : undefined,
	};
};
