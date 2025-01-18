import { ProgressBar } from 'primereact/progressbar';
import { HTMLAttributes } from 'react';
import { ProgressScoreboardConfig } from 'server/src/wig/domain/types/Scoreboard';

export type ProgressScoreboardProps = HTMLAttributes<HTMLDivElement> & {
	config: ProgressScoreboardConfig;
};

export const ProgressScoreboard = (props: ProgressScoreboardProps) => {
	const { config, style = {}, className = '' } = props;
	const { init, target, current, caption = '', unit = '' } = config;
	let percentage;
	if (current < init) {
		percentage = 0;
	} else if (current > target) {
		percentage = 100;
	} else {
		percentage = ((current - init) / (target - init)) * 100;
	}

	const valueTemplate = (rawValue: number) => `${rawValue}${unit}`;

	return (
		<div style={{ width: '100%', ...style }} className={`flex flex-column justify-content-start ${className}`}>
			<div className="flex flex-row align-items-bottom justify-content-between">
				<span className="pb-1">{valueTemplate(init)}</span>
				<span className="pb-1">{valueTemplate(target)}</span>
			</div>
			<div className="flex flex-row align-items-center justify-content-center">
				<ProgressBar className="flex-1" value={percentage} showValue={false} />
			</div>
			<span className="text-center pt-1">{valueTemplate(current)}</span>
			{caption && (
				<div className="flex flex-row">
					<span className="text-500 pt-0 pb-3">{caption}</span>
				</div>
			)}
		</div>
	);
};
