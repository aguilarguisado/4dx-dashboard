import { ScoreboardHistoryControllerImpl } from './controllers/ScoreboardHistoryControllerImpl';
import { CreateScoreboardHistoryDTOSchema } from './dtos/CreateScoreboardHistoryDTO';
import { getAppContainer } from '../../lib/inversify/container';
import { protectedProcedure, router } from '../../lib/trpc/trpc';
import { ScoreboardSchema } from '../../wig/domain/types/Scoreboard';

const getController = () => {
	return getAppContainer().get<ScoreboardHistoryControllerImpl>(ScoreboardHistoryControllerImpl);
};

export const scoreboardRouter = router({
	addScoreboardEntry: protectedProcedure
		.meta({ openapi: { method: 'POST', path: '/scoreboard', tags: ['Scoreboards'] } })
		.input(CreateScoreboardHistoryDTOSchema)
		.output(ScoreboardSchema)
		.mutation(async ({ input, ctx }) => {
			const user = ctx.user;
			return getController().createScoreboardHistory(user.organizationId, input);
		}),
});
