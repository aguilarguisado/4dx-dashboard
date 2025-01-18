import { authRouter } from '../../authentication/data/router';
import { router } from '../../lib/trpc/trpc';
import { organizationRouter } from '../../organization/data/router';
import { scoreboardRouter } from '../../scoreboard/data/router';
import { wigRouter } from '../../wig/data/router';

export const appRouter = router({
	auth: authRouter,
	organization: organizationRouter,
	wig: wigRouter,
	scoreboard: scoreboardRouter,
});

export type AppRouter = typeof appRouter;
