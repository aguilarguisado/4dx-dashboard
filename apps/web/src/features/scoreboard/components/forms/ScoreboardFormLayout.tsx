import { ProgressScoreboardFormLayout } from './ProgressScoreboardFormLayout';
import { SeriesScoreboardFormLayout } from './SeriesScoreboardFormLayout';
import { useScoreboardFormContext } from '../../contexts/ScoreboardFormContext';

import { useTranslation } from '@/hooks/UseTranslation';
import { useAppSelector } from '@/store/store';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { TabPanel, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { useState } from 'react';

export const ScoreboardFormLayout = () => {
	const { mode, containerType, containerId } = useScoreboardFormContext();
	const wig = useAppSelector((state) => state.wigDetail.wig);
	if (!wig) {
		throw new Error('ScoreboardFormLayout must be used within a WIG context');
	}
	const [activeIndex, setActiveIndex] = useState(() => {
		let scoreboard;
		switch (containerType) {
			case 'wig':
				scoreboard = wig.scoreboard;
				break;
			case 'lag':
				scoreboard = wig.lags?.find((lag) => lag.id === containerId)?.scoreboard;
				break;
			case 'lead':
				scoreboard = wig.leads?.find((lead) => lead.id === containerId)?.scoreboard;
				break;
		}
		const visualizationType = scoreboard?.visualizationType;
		switch (visualizationType) {
			case 'progress':
				return 0;
			case 'series':
				return 1;
			default:
				return 0;
		}
	});

	const progressHeader = useTranslation({ id: 'scoreboard.visualizationType.label.progress' });
	const seriesHeader = useTranslation({ id: 'scoreboard.visualizationType.label.series' });
	const message = useTranslation({ id: 'scoreboard.warning.changeVisualization' });
	const header = useTranslation({ id: 'action.confirmation' });

	const onTabChange = (e: TabViewTabChangeEvent) => {
		if (activeIndex === e.index) return;
		// Check if is possible to change tab
		if (mode === 'edit') {
			confirmDialog({
				message,
				header,
				icon: 'pi pi-exclamation-triangle',
				accept: () => setActiveIndex(e.index),
			});
		} else {
			setActiveIndex(e.index);
		}
	};

	return (
		<div className="flex flex-row">
			<TabView className="w-full" activeIndex={activeIndex} onTabChange={onTabChange}>
				<TabPanel header={progressHeader} className="w-full">
					<ProgressScoreboardFormLayout />
				</TabPanel>
				<TabPanel header={seriesHeader} className="w-full">
					<SeriesScoreboardFormLayout />
				</TabPanel>
			</TabView>
			<ConfirmDialog />
		</div>
	);
};
