import { LagFormContainer } from '../../../lag/components/LagForm';

import { EditButton } from '@/components/EditButton';
import { ScoreboardComponent } from '@/features/scoreboard';
import { useHover } from '@/hooks/UseHover';

import { Card } from 'primereact/card';
import { LagMeasurement } from 'server/src/wig/domain/types/LagMeasurement';

export type WIGLagsViewProps = {
	lags: LagMeasurement[];
};

type WIGLagItemProps = {
	lag: LagMeasurement;
	index: number;
};

export const WIGLagsView = (props: WIGLagsViewProps) => {
	const { lags } = props;

	if (!lags?.length) return null;
	// TODO: translate
	return (
		<>
			<span className="m-3 mt-5 text-4xl text-primary">
				<i className="pi pi-check-circle text-2xl pr-2"></i>
				Lag measurements
			</span>
			<div className="grid">
				{lags.map((lag, index) => {
					return (
						<div className="col-12 lg:col-6" key={index}>
							<LagItem lag={lag} index={index} />
						</div>
					);
				})}
			</div>
		</>
	);
};

const LagItem = (props: WIGLagItemProps) => {
	const { lag, index } = props;
	const lagClass = `lag_${index}`;
	const { isHovered } = useHover(`.${lagClass}`);

	return (
		<>
			<Card
				title={<LagTitle {...props} isHovered={isHovered} />}
				subTitle={lag.subtitle}
				className={`flex flex-column col-6 w-full ${lagClass}`}
			>
				{lag.scoreboard && <ScoreboardComponent scoreboard={lag.scoreboard} style={{ width: '100%' }} />}
			</Card>
		</>
	);
};

const LagTitle = (props: WIGLagItemProps & { isHovered: boolean }) => {
	const { lag, isHovered } = props;
	return (
		<div className="flex flex-row align-items-center justify-content-between" style={{ minHeight: '46px' }}>
			<div>{lag.title}</div>

			<LagFormContainer lagId={lag.id} launcher={isHovered && <EditButton />} mode="edit" />
		</div>
	);
};
