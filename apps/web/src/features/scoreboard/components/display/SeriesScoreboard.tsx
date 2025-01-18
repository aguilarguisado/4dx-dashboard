import { getTargetReferenceAnnotation } from '../../utils/ScoreboardBuilder';

import { Chart } from 'primereact/chart';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { SeriesScoreboardConfig } from 'server/src/wig/domain/types/Scoreboard';

export type SeriesScoreboardElement = {
	label: string | Date;
	value: number;
};

export type SeriesScoreboardProps = {
	elements: SeriesScoreboardElement[];
	config: SeriesScoreboardConfig;
	style?: React.CSSProperties;
};

export const SeriesScoreboard: React.FC<SeriesScoreboardProps> = (props: SeriesScoreboardProps) => {
	const { elements, style = {}, config } = props;
	const { label, reference, type } = config;

	const options = useMemo(() => {
		if (!reference) return {};

		const referenceAnnotation = getTargetReferenceAnnotation({ target: reference });
		return {
			plugins: {
				annotation: {
					annotations: referenceAnnotation,
				},
			},
		};
	}, [reference]);

	const chartData = getChartData({ label, elements });
	return (
		<div style={{ width: '100%' }}>
			<Chart type={type} data={chartData} options={options} style={{ height: '200px', ...style }} />
		</div>
	);
};

const getChartData = ({ label, elements }: { label?: string; elements: SeriesScoreboardElement[] }) => {
	// TODO: memoize this
	const intl = useIntl();
	const defaultLabel = intl.formatMessage({ id: 'scoreboard.series.default.label' });
	const documentStyle = getComputedStyle(document.documentElement);
	const dataLabels = elements.map((element) => {
		const elementLabel = element.label;
		if (elementLabel instanceof Date) {
			return intl.formatDate(elementLabel);
		} else {
			return elementLabel;
		}
	});
	const data = elements.map((d) => d.value);
	const datasetLabel = label ?? defaultLabel;
	return {
		labels: dataLabels,
		datasets: [
			{
				label: datasetLabel,
				backgroundColor: documentStyle.getPropertyValue('--primary-color'),
				data,
				tension: 0.4,
				// fill: true,
			},
		],
	};
};
