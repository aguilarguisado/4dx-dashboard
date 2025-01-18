import { initAllChartJS } from './lib/ChartJS';

import App from '@/App';

import React from 'react';
import ReactDOM from 'react-dom/client';
// Initialize ChartJS
initAllChartJS();

const app = document.getElementById('app');
if (!app) throw new Error('No app element found');
const root = ReactDOM.createRoot(app);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
