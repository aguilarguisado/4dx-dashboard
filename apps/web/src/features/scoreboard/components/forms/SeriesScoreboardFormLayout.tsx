// ProgressScoreboardForm.tsx
import { ScoreboardHistoryEntryPanel } from './ScoreboardHistoryEntryPanel';
import { SeriesScoreboardTypeSelector } from './SeriesScoreboardTypeSelector';
import { useScoreboardFormContext } from '../../contexts/ScoreboardFormContext';
import { SeriesScoreboard, SeriesScoreboardElement } from '../display/SeriesScoreboard';

import { InputNumberControl } from '@/components/forms/controls/InputNumberControl';
import { InputTextControl } from '@/components/forms/controls/InputTextControl';
import { useFormNamespace } from '@/hooks/UseFormNamespace';
import { useAppSelector } from '@/store/store';
import { FormMode } from '@/types/forms';

import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
	ScoreboardVisualizationType,
	SeriesScoreboardConfig,
	SeriesScoreboardType,
} from 'server/src/wig/domain/types/Scoreboard';

type SeriesScoreboardFormLayout = {
	showPreview?: boolean;
};

export const SeriesScoreboardFormLayout = (props: SeriesScoreboardFormLayout) => {
	const { showPreview = true } = props;
	const { namespace, containerId, containerType, mode } = useScoreboardFormContext();
	const wig = useAppSelector((state) => state.wigDetail.wig);
	if (!wig) {
		throw new Error('SeriesScoreboardFormLayout must be used within a WIG context');
	}
	const [scoreboard, setScoreboard] = useState(wig?.scoreboard);
	const formNamespace = useFormNamespace(namespace);
	const chartType = formNamespace.getValue<SeriesScoreboardType>('config.type') ?? 'line';
	formNamespace.watchNamespace('config');
	useEffect(() => {
		formNamespace.setValueWithNamespace<ScoreboardVisualizationType>('visualizationType', 'series');
		formNamespace.setValueWithNamespace<SeriesScoreboardConfig>('config', { type: 'line' });
	}, []);

	useEffect(() => {
		const getScoreboard = () => {
			switch (containerType) {
				case 'wig':
					return wig?.scoreboard;
				case 'lag':
					return wig?.lags?.find((lag) => lag.id === containerId)?.scoreboard;
				case 'lead':
					return wig?.leads?.find((lead) => lead.id === containerId)?.scoreboard;
				default:
					throw new Error('Invalid container type');
			}
		};
		const scoreboard = getScoreboard();
		setScoreboard(scoreboard);
	}, [wig]);

	const onTypeChange = (value: SeriesScoreboardType) => {
		formNamespace.setValueWithNamespace<SeriesScoreboardType>('config.type', value);
	};

	const showAddEntry =
		mode === 'edit' && !!formNamespace.getValue<string>('id') && scoreboard?.visualizationType === 'series';

	return (
		<div className="flex flex-column gap-2">
			<SeriesScoreboardTypeSelector value={chartType} onChange={onTypeChange} />
			{showPreview && (
				<SeriesScoreboardChart namespace={namespace} chartData={scoreboard?.data ?? []} mode={mode} />
			)}
			<div>
				{showAddEntry && (
					<span className="text-primary cursor-pointer">
						<ScoreboardHistoryEntryPanel launcher={<FormattedMessage id="scoreboard.series.entry.add" />} />
					</span>
				)}
				{!showAddEntry && (
					<span className="text-500">
						<FormattedMessage id="scoreboard.series.warning.save_to_add_entry" />
					</span>
				)}
			</div>
			<InputTextControl
				name={formNamespace.getNameKey('config.label')}
				label={{ id: 'scoreboard.series.form.label.label' }}
			/>
			<InputNumberControl
				name={formNamespace.getNameKey('config.reference')}
				label={{ id: 'scoreboard.series.form.label.reference' }}
			/>
		</div>
	);
};

const SeriesScoreboardChart = ({
	namespace,
	chartData,
	mode,
}: {
	mode: FormMode;
	namespace?: string;
	chartData?: SeriesScoreboardElement[];
}) => {
	const formNamespace = useFormNamespace(namespace);
	const config = formNamespace.getValue<SeriesScoreboardConfig>('config');
	const chartType = config?.type ?? 'line';
	if (mode === 'create') {
		return <SamplePreview typeValue={chartType} />;
	} else {
		return (
			<SeriesScoreboard
				elements={chartData ?? []}
				config={config ?? { type: 'line' }}
				style={{ width: '70%', alignSelf: 'center' }}
			/>
		);
	}
};

const SamplePreview = ({ typeValue }: { typeValue: SeriesScoreboardType }) => {
	const getElements = () => {
		const today = new Date();
		const elements = [];
		for (let i = 10; i > 0; i--) {
			const secondsEarlier = 1000 * 3600 * 24 * 7 * i;
			const label = new Date(today.getTime() - secondsEarlier);
			const value = (10 - Math.abs(5 - i)) * 6;
			elements.push({ label, value });
		}
		return elements;
	};

	// TODO: translate
	const label = 'Preview Serie Scoreboard with a target reference of 60';
	const config = { label, type: typeValue, reference: 60 };
	return (
		<>
			<div className="flex flex-column justify-content-center gap-2">
				<Message severity="warn" text="This is a preview sample. No data yet."></Message>
				<SeriesScoreboard
					elements={getElements()}
					config={config}
					style={{ width: '70%', alignSelf: 'center' }}
				/>
			</div>
		</>
	);
};
