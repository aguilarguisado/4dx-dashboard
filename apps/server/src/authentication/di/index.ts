import { AuthControllerImpl } from '../data/controllers/AuthControllerImpl';
import { FirebaseAuthRepository } from '../data/repositories/FirebaseAuthRepository';
import { AuthRepository } from '../domain/AuthRepository';
import { CreateUserUseCase } from '../domain/usecases/CreateUserUseCase';
import { GetAuthUserUseCase } from '../domain/usecases/GetAuthUserUseCase';

import { ContainerModule } from 'inversify';

export const authModule = new ContainerModule((bind) => {
	bind<AuthRepository>(Symbol.for('AuthRepository')).to(FirebaseAuthRepository).inSingletonScope();
	bind<GetAuthUserUseCase>(GetAuthUserUseCase).toSelf().inSingletonScope();
	bind<CreateUserUseCase>(CreateUserUseCase).toSelf().inSingletonScope();
	bind<AuthControllerImpl>(AuthControllerImpl).toSelf().inSingletonScope();
});
