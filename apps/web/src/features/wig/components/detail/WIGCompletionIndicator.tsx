import { WIGSidenavHeader } from './WIGSidenavHeader';

import { useTranslation } from '@/hooks/UseTranslation';

import { IntlObject } from 'i18n';
import { Knob } from 'primereact/knob';
import { WIG } from 'server/src/wig/domain/models/WIG';

export type WIGCompletionIndicatorProps = {
	wig: WIG;
};

export const WIGCompletionIndicator = (props: WIGCompletionIndicatorProps) => {
	const { wig } = props;
	const title = useTranslation({ id: 'wig.completion.title' });
	const subtitleNotCompleted = useTranslation({ id: 'wig.completion.subtitleNotCompleted' });
	const subtitleCompleted = useTranslation({ id: 'wig.completion.subtitleCompleted' });
	const showScoreboard = !wig.scoreboard;
	const showLead = !wig.leads?.length;
	const showLag = !wig.lags?.length;

	const total = 4;
	let completed = 1;
	if (!showScoreboard) completed++;
	if (!showLead) completed++;
	if (!showLag) completed++;
	const subtitle = completed === total ? subtitleCompleted : subtitleNotCompleted;

	const getValue = () => {
		return ~~((completed / total) * 100);
	};

	const getValueText = () => {
		return `${completed}/${total}`;
	};

	return (
		<div>
			<WIGSidenavHeader title={title} subtitle={subtitle} />
			<Knob value={getValue()} valueTemplate={getValueText()} />
			{showScoreboard && <PendingItem item={{ id: 'wig.completion.scoreboard' }} />}
			{showLag && <PendingItem item={{ id: 'wig.completion.lag' }} />}
			{showLead && <PendingItem item={{ id: 'wig.completion.lead' }} />}
		</div>
	);
};

const PendingItem = ({ item }: { item: IntlObject }) => {
	const text = useTranslation(item);
	return <div className="text-400 col-12 py-0">{text}</div>;
};
