import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
// import 'primereact/resources/themes/lara-dark-amber/theme.css';
// import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/themes/lara-light-green/theme.css';
import './styles.css';

import { AuthProvider } from './auth/context/AuthContext';
import { ReactIntlContext } from './context/ReactIntlContext';
import { availableTranslations } from './lib/ReactIntl';
import { initTRPC, trpc } from './lib/trpc';
import { initRouter } from './router';
import { store } from './store/store';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import { useState } from 'react';
import { Provider } from 'react-redux';

const router = initRouter();
const translations = availableTranslations;

function AppWrapper() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);
	const [trpcClient] = useState(initTRPC);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<ReactIntlContext translations={translations}>
					<PrimeReactProvider>
						<AuthProvider>
							<Provider store={store}>{router}</Provider>
						</AuthProvider>
					</PrimeReactProvider>
				</ReactIntlContext>
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default AppWrapper;
