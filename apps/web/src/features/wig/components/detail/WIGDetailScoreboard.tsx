import { WIGScoreboardFormContainer } from '../WIGScoreboardFormContainer';

import { EditButton } from '@/components/EditButton';
import { ScoreboardComponent } from '@/features/scoreboard';
import { useHover } from '@/hooks/UseHover';
import { useAppSelector } from '@/store/store';

import { HTMLAttributes, useMemo } from 'react';

export type WIGDetailScoreboardProps = HTMLAttributes<HTMLDivElement>;

export const WIGDetailScoreboard = (props: WIGDetailScoreboardProps) => {
	const { className = '' } = props;
	const { isHovered } = useHover('.wigScoreboard');
	const scoreboard = useAppSelector((state) => state.wigDetail.wig?.scoreboard);
	const scoreboardComponent = useMemo(() => {
		return scoreboard && <ScoreboardComponent scoreboard={scoreboard} />;
	}, [scoreboard]);
	return (
		<div className={`flex flex-column w-full wigScoreboard gap-2 ${className}`}>
			<div className="flex flex-row gap-2">
				<span className="text-lg font-bold">Scoreboard</span>
				<WIGScoreboardFormContainer launcher={isHovered && <EditButton />} mode="edit" />
			</div>
			{scoreboardComponent}
		</div>
	);
};
