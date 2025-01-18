import { ScoreboardHistorySchema } from '../models/ScoreboardHistory';

import { z } from 'zod';

export const CreateScoreboardHistorySchema = ScoreboardHistorySchema.omit({
	id: true,
	organizationId: true,
});

export type CreateScoreboardHistory = z.infer<typeof CreateScoreboardHistorySchema>;
