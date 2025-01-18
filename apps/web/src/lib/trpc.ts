import { getAuthToken } from '@/auth/context/AuthContext';

import { createTRPCReact, httpLink } from '@trpc/react-query';
import { IntlObject } from 'i18n';
import { AppRouter } from 'server/src';
import SuperJSON from 'superjson';

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

export const initTRPC: () => ReturnType<typeof trpc.createClient> = () =>
	trpc.createClient({
		links: [
			httpLink({
				url: 'http://localhost:3015/trpc',
				async headers() {
					return {
						authorization: await getAuthToken(),
					};
				},
			}),
		],
		transformer: SuperJSON,
	});

export const parseApiError: (message?: string) => IntlObject | undefined = (message?: string) => {
	if (!message) return;
	try {
		return JSON.parse(message) as IntlObject;
	} catch {
		return { id: message } as IntlObject;
	}
};
