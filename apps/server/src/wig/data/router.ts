import { WIGControllerImpl } from './controllers/WIGControllerImpl';
import { CreateLagDTOSchema } from './dtos/CreateLagDTO';
import { CreateLeadDTOSchema } from './dtos/CreateLeadDTO';
import { CreateWIGDTOSchema } from './dtos/CreateWIGDTO';
import { DeleteLagDTOSchema } from './dtos/DeleteLagDTO';
import { DeleteLeadDTOSchema } from './dtos/DeleteLeadDTO';
import { UpdateLagDTOSchema } from './dtos/UpdateLagDTO';
import { UpdateLeadDTOSchema } from './dtos/UpdateLeadDTO';
import { WIGIdDTOSchema } from './dtos/WIGIdDTO';
import { WIGScoreboardDTOSchema } from './dtos/WIGScoreboardDTO';
import { IdModelSchema } from '../../common/domain/models/BaseModel';
import { getAppContainer } from '../../lib/inversify/container';
import { protectedProcedure, router } from '../../lib/trpc/trpc';
import { WIGSchema } from '../domain/models/WIG';
import { LagMeasurementSchema } from '../domain/types/LagMeasurement';
import { LeadMeasurementSchema } from '../domain/types/LeadMeasurement';
import { UpdateGeneralSectionSchema } from '../domain/types/UpdateGeneralSection';

import { z } from 'zod';

const getController = () => getAppContainer().get<WIGControllerImpl>(WIGControllerImpl);

export const wigRouter = router({
	getWIGs: protectedProcedure
		.meta({ openapi: { method: 'GET', path: '/wigs', tags: ['WIGs'] } })
		.input(z.void())
		.output(z.array(WIGSchema))
		.query(async ({ ctx }) => {
			const user = ctx.user;
			return getController().getWIGs(user.organizationId);
		}),
	getWIG: protectedProcedure
		.meta({ openapi: { method: 'GET', path: '/wigs/{id}', tags: ['WIGs'] } })
		.input(z.object({ id: z.string() }))
		.output(WIGSchema)
		.query(async ({ input, ctx }) => {
			const user = ctx.user;
			return getController().getWIGFromOrganization(user.organizationId, input.id);
		}),
	createWIG: protectedProcedure
		.meta({ openapi: { method: 'POST', path: '/wigs', tags: ['WIGs'] } })
		.input(CreateWIGDTOSchema)
		.output(IdModelSchema)
		.mutation(({ ctx, input }) => {
			const user = ctx.user;
			return getController().createWIG(user.organizationId, input);
		}),
	updateWIG: protectedProcedure
		.meta({ openapi: { method: 'PUT', path: '/wigs/{id}', tags: ['WIGs'] } })
		.input(UpdateGeneralSectionSchema)
		.output(z.void())
		.mutation(({ ctx, input }) => {
			const user = ctx.user;
			return getController().updateWIG(user.organizationId, input);
		}),
	deleteWIG: protectedProcedure
		.meta({ openapi: { method: 'DELETE', path: '/wigs/{id}', tags: ['WIGs'] } })
		.input(IdModelSchema)
		.output(z.void())
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().deleteWIG(user.organizationId, input.id);
		}),
	addLead: protectedProcedure
		.meta({ openapi: { method: 'POST', path: '/wigs/{wigId}/leads', tags: ['Leads'] } })
		.input(CreateLeadDTOSchema)
		.output(LeadMeasurementSchema)
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().addWIGLead(user.organizationId, input);
		}),
	updateLead: protectedProcedure
		.meta({ openapi: { method: 'PUT', path: '/wigs/{wigId}/leads/{id}', tags: ['Leads'] } })
		.input(UpdateLeadDTOSchema)
		.output(LeadMeasurementSchema)
		.mutation(async ({ input, ctx }) => {
			const user = ctx.user;
			return getController().updateWIGLead(user.organizationId, input);
		}),
	deleteLead: protectedProcedure
		.meta({ openapi: { method: 'DELETE', path: '/wigs/{wigId}/leads/{id}', tags: ['Leads'] } })
		.input(DeleteLeadDTOSchema)
		.output(z.void())
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().deleteWIGLead(user.organizationId, input.wigId, input.id);
		}),
	addLag: protectedProcedure
		.meta({ openapi: { method: 'POST', path: '/wigs/{wigId}/lags', tags: ['Lags'] } })
		.input(CreateLagDTOSchema)
		.output(LagMeasurementSchema)
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().addWIGLag(user.organizationId, input);
		}),
	updateLag: protectedProcedure
		.meta({ openapi: { method: 'PUT', path: '/wigs/{wigId}/lags/{id}', tags: ['Lags'] } })
		.input(UpdateLagDTOSchema)
		.output(LagMeasurementSchema)
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().updateWIGLag(user.organizationId, input);
		}),
	deleteLag: protectedProcedure
		.meta({ openapi: { method: 'DELETE', path: '/wigs/{wigId}/lags/{id}', tags: ['Lags'] } })
		.input(DeleteLagDTOSchema)
		.output(z.void())
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().deleteWIGLag(user.organizationId, input.wigId, input.id);
		}),
	createScoreboard: protectedProcedure
		.meta({ openapi: { method: 'POST', path: '/wigs/{wigId}/scoreboard', tags: ['Scoreboards'] } })
		.input(WIGScoreboardDTOSchema)
		.output(WIGSchema)
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().createScoreboard(user.organizationId, input);
		}),
	updateScoreboard: protectedProcedure
		.meta({ openapi: { method: 'PUT', path: '/wigs/{wigId}/scoreboard', tags: ['Scoreboards'] } })
		.input(WIGScoreboardDTOSchema)
		.output(WIGSchema)
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().updateScoreboard(user.organizationId, input);
		}),
	deleteScoreboard: protectedProcedure
		.meta({ openapi: { method: 'DELETE', path: '/wigs/{wigId}/scoreboard', tags: ['Scoreboards'] } })
		.input(WIGIdDTOSchema)
		.output(z.void())
		.mutation(({ input, ctx }) => {
			const user = ctx.user;
			return getController().deleteScoreboard(user.organizationId, input.wigId);
		}),
});
