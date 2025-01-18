import 'dotenv/config';
import 'reflect-metadata';
import { appRouter } from './common/data/router';
import { createContext } from './lib/trpc/context';
import { getSwaggerDocument } from './lib/trpc/swagger-config';

import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';

dotenv.config();
const serverHost = process.env.SERVER_HOST;
const serverPort = process.env.SERVER_PORT;
if (!serverHost || !serverPort) {
	throw new Error('SERVER_HOST and SERVER_PORT must be set in .env');
}
export const serverURL = `${serverHost}:${serverPort}`;
const app: Express = express();

app.use(cors());

app.use(
	'/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);
app.use(
	'/api',
	createOpenApiExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getSwaggerDocument({ url: `${serverURL}/api` })));

app.listen(serverPort);

export default app;
export type AppRouter = typeof appRouter;
