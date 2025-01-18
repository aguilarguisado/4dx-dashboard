import { useTranslation } from '@/hooks/UseTranslation';

import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { SeriesScoreboardType } from 'server/src/wig/domain/types/Scoreboard';

export type SeriesScoreboardTypeSelectorProps = {
	value: SeriesScoreboardType;
	onChange: (value: SeriesScoreboardType) => void;
};

export const SeriesScoreboardTypeSelector = (props: SeriesScoreboardTypeSelectorProps) => {
	const { value, onChange } = props;
	const lineLabel = useTranslation({ id: 'scoreboard.series.type.line' }) ?? '';
	const barLabel = useTranslation({ id: 'scoreboard.series.type.bar' }) ?? '';

	const options: { label: string; value: SeriesScoreboardType }[] = [
		{ label: lineLabel, value: 'line' },
		{ label: barLabel, value: 'bar' },
	];
	return (
		<SelectButton
			value={value}
			options={options}
			onChange={(e: SelectButtonChangeEvent) => {
				if (e.value && e.value !== value) {
					onChange(e.value);
				}
			}}
		></SelectButton>
	);
};
