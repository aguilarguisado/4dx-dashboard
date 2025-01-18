import { createContext } from './context';
import { UnauthorizedApiError } from '../../common/data/exceptions/UnauthorizedApiError';

import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
	transformer: SuperJSON,
});

export const middleware = t.middleware;
export const router = t.router;
export const appCreateCallerFactory = t.createCallerFactory;

/**
 * Public procedures
 **/
export const publicProcedure = t.procedure;

/**
 * Authenticated procedures
 **/
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
	const { ctx } = opts;
	if (!ctx.user) {
		throw new UnauthorizedApiError();
	}
	return opts.next({
		ctx: {
			user: ctx.user,
		},
	});
});

export const superAdminProcedure = protectedProcedure.use(async function isSuperAdmin(opts) {
	const { ctx } = opts;
	if (ctx.user?.role !== 'superadmin') {
		throw new UnauthorizedApiError();
	}
	return opts.next({
		ctx: {
			user: ctx.user,
		},
	});
});
