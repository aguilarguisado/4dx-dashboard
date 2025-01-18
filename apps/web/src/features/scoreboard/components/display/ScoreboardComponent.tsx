import { ProgressScoreboard } from './ProgressScoreboard';
import { SeriesScoreboard } from './SeriesScoreboard';

import { HTMLAttributes, useMemo } from 'react';
import {
	ProgressScoreboardConfig,
	Scoreboard,
	ScoreboardConfigType,
	SeriesScoreboardConfig,
} from 'server/src/wig/domain/types/Scoreboard';

export type ScoreboardProps = HTMLAttributes<HTMLDivElement> & {
	scoreboard: Scoreboard;
};

export const ScoreboardComponent = (props: ScoreboardProps) => {
	const { scoreboard, style } = props;
	const { config } = props.scoreboard;
	const propsKey = JSON.stringify(props);
	const component = useMemo(() => getScoreboardComponent(scoreboard, config, style), [propsKey]);
	return component;
};

const getScoreboardComponent = (scoreboard: Scoreboard, config: ScoreboardConfigType, style?: React.CSSProperties) => {
	switch (scoreboard.visualizationType) {
		case 'progress':
			return <ProgressScoreboard config={config as ProgressScoreboardConfig} style={style} />;
		case 'series':
			return (
				<SeriesScoreboard
					elements={scoreboard.data ?? []}
					config={config as SeriesScoreboardConfig}
					style={style}
				/>
			);
		default:
			return <div>Chart {scoreboard.visualizationType} not supported</div>;
	}
};
