import { BaseModelSchema } from '../../../common/domain/models/BaseModel';

import { z } from 'zod';

export const ScoreboardHistoryTypeSchema = z.enum(['wig', 'lead', 'lag']);

export const ScoreboardHistorySchema = BaseModelSchema.extend({
	organizationId: z.string(),
	wigId: z.string(),
	containerId: z.string(),
	scoreboardId: z.string(),
	containerType: ScoreboardHistoryTypeSchema,
	date: z.date(),
	value: z.number(),
	comment: z.string().optional(),
});

export type ScoreboardHistoryType = z.infer<typeof ScoreboardHistoryTypeSchema>;
export type ScoreboardHistory = z.infer<typeof ScoreboardHistorySchema>;
