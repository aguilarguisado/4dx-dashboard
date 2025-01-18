import { OrganizationControllerImpl } from '../data/controllers/OrganizationControllerImpl';
import { OrganizationRepositoryImpl } from '../data/repositories/OrganizationRepositoryImpl';
import { OrganizationInteractor } from '../domain/interactors/OrganizationInteractor';
import { OrganizationRepository } from '../domain/repositories/OrganizationRepository';
import { CreateOrganizationUseCase } from '../domain/usecases/CreateOrganizationUseCase';

import { ContainerModule } from 'inversify';
export const organizationInjectTypes = {
	organizationRepository: Symbol.for('OrganizationRepository'),
};
export const organizationModule = new ContainerModule((bind) => {
	bind<OrganizationRepository>(organizationInjectTypes.organizationRepository)
		.to(OrganizationRepositoryImpl)
		.inSingletonScope();
	bind<CreateOrganizationUseCase>(CreateOrganizationUseCase).toSelf().inSingletonScope();
	bind<OrganizationInteractor>(OrganizationInteractor).toSelf().inSingletonScope();
	bind<OrganizationControllerImpl>(OrganizationControllerImpl).toSelf().inSingletonScope();
});
