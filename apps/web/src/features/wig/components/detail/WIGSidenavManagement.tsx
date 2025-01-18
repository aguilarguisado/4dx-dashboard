import { WIGDeleteDialog } from './WIGDeleteDialog';
import { WIGSidenavHeader } from './WIGSidenavHeader';
import { LagFormContainer } from '../../../lag/components/LagForm';
import { LeadFormContainer } from '../../../lead/components/LeadForm';
import { WIGScoreboardFormContainer } from '../WIGScoreboardFormContainer';

import { useTranslation } from '@/hooks/UseTranslation';

import { FormattedMessage } from 'react-intl';

export type WIGSidenavManagementProps = {
	wigId: string;
};

export const WIGSidenavManagement = (props: WIGSidenavManagementProps) => {
	const { wigId } = props;
	const title = useTranslation({ id: 'wig.management.title' });
	const subtitle = useTranslation({ id: 'sidenav.management.subtitle' });
	return (
		<div>
			<WIGSidenavHeader title={title} subtitle={subtitle} />
			<div className="flex flex-column m-2 gap-2">
				<CreateScoreboardOption />
				<CreateLeadMeasurementOption />
				<CreateLagMeasurementOption />
				<DeleteWIGOption wigId={wigId} />
			</div>
		</div>
	);
};

const CreateScoreboardOption = () => {
	return (
		<WIGScoreboardFormContainer
			launcher={
				<span className="cursor-pointer">
					<FormattedMessage id="wig.management.createScoreboard" />
				</span>
			}
			mode="create"
		/>
	);
};

const CreateLeadMeasurementOption = () => {
	return (
		<LeadFormContainer
			launcher={
				<span className="cursor-pointer">
					<FormattedMessage id="wig.management.createLead" />
				</span>
			}
			mode="create"
		/>
	);
};

const CreateLagMeasurementOption = () => {
	return (
		<div>
			<LagFormContainer
				launcher={
					<span className="cursor-pointer">
						<FormattedMessage id="wig.management.createLag" />
					</span>
				}
				mode="create"
			/>
		</div>
	);
};

const DeleteWIGOption = ({ wigId }: { wigId: string }) => {
	return (
		<div>
			<WIGDeleteDialog
				launcher={
					<span className="cursor-pointer">
						<FormattedMessage id="wig.management.delete" />
					</span>
				}
				wigId={wigId}
			/>
		</div>
	);
};
