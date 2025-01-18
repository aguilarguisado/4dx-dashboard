import { GetAuthUserUseCase } from '../../authentication/domain/usecases/GetAuthUserUseCase';
import { getAppContainer } from '../inversify/container';

import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = async ({ req }: trpcExpress.CreateExpressContextOptions) => {
	let user = null;
	if (req.headers.authorization) {
		const getAuthUserUseCase = getAppContainer().get<GetAuthUserUseCase>(GetAuthUserUseCase);
		const token = req.headers.authorization.split(' ')[1];
		const either = await getAuthUserUseCase.execute(token);
		if (either.isRight()) {
			user = either.extract();
		}
	}
	return {
		user,
	};
};
