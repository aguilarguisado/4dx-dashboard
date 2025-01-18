import { AuthControllerImpl } from './controllers/AuthControllerImpl';
import { getAppContainer } from '../../lib/inversify/container';
import { router, superAdminProcedure } from '../../lib/trpc/trpc';
import { AuthenticatedUserSchema, CreateUserSchema } from '../domain/models/AuthenticatedUser';

const getController = () => getAppContainer().get<AuthControllerImpl>(AuthControllerImpl);

export const authRouter = router({
	createUser: superAdminProcedure
		.meta({ openapi: { method: 'POST', path: '/auth/create-user', tags: ['Auth'] } })
		.input(CreateUserSchema)
		.output(AuthenticatedUserSchema)
		.query(async ({ input }) => {
			return getController().createUser(input);
		}),
});
