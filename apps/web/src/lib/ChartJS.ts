import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
export const initAllChartJS = () => {
	Chart.register(annotationPlugin);
};
