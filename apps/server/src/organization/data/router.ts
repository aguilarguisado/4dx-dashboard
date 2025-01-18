import { OrganizationControllerImpl } from './controllers/OrganizationControllerImpl';
import { CreateOrganizationDTOSchema } from './dtos/CreateOrganizationDTO';
import { getAppContainer } from '../../lib/inversify/container';
import { router, superAdminProcedure } from '../../lib/trpc/trpc';
import { OrganizationSchema } from '../domain/models/Organization';

const getController = () => getAppContainer().get<OrganizationControllerImpl>(OrganizationControllerImpl);

export const organizationRouter = router({
	createOrganization: superAdminProcedure
		.meta({ openapi: { method: 'POST', path: '/organizations', tags: ['Organizations'] } })
		.input(CreateOrganizationDTOSchema)
		.output(OrganizationSchema)
		.query(async ({ input }) => {
			return getController().createOrganization(input);
		}),
});
