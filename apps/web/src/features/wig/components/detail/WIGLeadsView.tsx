import { LeadFormContainer } from '../../../lead/components/LeadForm';

import { EditButton } from '@/components/EditButton';
import { ScoreboardComponent } from '@/features/scoreboard';
import { useHover } from '@/hooks/UseHover';
import { useTranslation } from '@/hooks/UseTranslation';

import { Card } from 'primereact/card';
import { LeadMeasurement } from 'server/src/wig/domain/types/LeadMeasurement';

export type WIGLeadsViewProps = {
	leads: LeadMeasurement[];
};

type WIGLeadItemProps = {
	lead: LeadMeasurement;
	index: number;
};

export const WIGLeadsView = (props: WIGLeadsViewProps) => {
	const { leads } = props;

	if (!leads?.length) return null;

	return (
		<div className="grid">
			{leads.map((lead, index) => {
				return (
					<div className="col-12 md:col-6" key={index}>
						<LeadItem lead={lead} index={index} />
					</div>
				);
			})}
		</div>
	);
};
const LeadItem = (props: WIGLeadItemProps) => {
	const { lead, index } = props;
	const title = useTranslation({ id: 'wig.detail.lead', values: { index: index + 1 } });
	const leadClass = `lead_${index + 1}`;
	const { isHovered } = useHover(`.${leadClass}`);

	return (
		<>
			<Card
				title={<LeadTitle {...props} title={title} isHovered={isHovered} />}
				subTitle={lead.name}
				className={`flex flex-column col-6 w-full ${leadClass}`}
			>
				{lead.scoreboard && <ScoreboardComponent scoreboard={lead.scoreboard} style={{ width: '100%' }} />}
			</Card>
		</>
	);
};

type LeadTitleProps = {
	isHovered: boolean;
	title?: string;
} & WIGLeadItemProps;

const LeadTitle = (props: LeadTitleProps) => {
	const { lead, title, isHovered } = props;
	return (
		<div className="flex flex-row align-items-center justify-content-between" style={{ minHeight: '46px' }}>
			{title && <div>{title}</div>}
			<LeadFormContainer launcher={isHovered && <EditButton />} mode="edit" leadId={lead.id} />
		</div>
	);
};
