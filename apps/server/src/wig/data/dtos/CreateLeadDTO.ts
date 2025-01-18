import { toScoreboardModel } from './ScoreboardDTO';
import { UpdateLeadDTOSchema } from './UpdateLeadDTO';
import { CreateLead } from '../../domain/types/CreateLead';

import { z } from 'zod';

export const CreateLeadDTOSchema = UpdateLeadDTOSchema.omit({
	id: true,
});

export type CreateLeadDTO = z.infer<typeof CreateLeadDTOSchema>;

export const toCreateLeadModel = (dto: CreateLeadDTO): CreateLead => {
	return {
		name: dto.name,
		scoreboard: dto.scoreboard ? toScoreboardModel(dto.scoreboard) : undefined,
	};
};
