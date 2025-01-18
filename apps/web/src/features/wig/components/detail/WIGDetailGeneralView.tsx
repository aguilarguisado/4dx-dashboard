import { WIGFormContainer } from '../WIGFormContainer';

import { CardEditableHeader } from '@/components/CardEditableHeader';
import { useTranslation } from '@/hooks/UseTranslation';

import { Card } from 'primereact/card';
import { useState } from 'react';
import { FormattedDate } from 'react-intl';
import { GeneralWIGInfo } from 'server/src/wig/domain/models/WIG';

export type WIGDetailGeneralViewProps = {
	wigInfo: GeneralWIGInfo;
};

export const WIGDetailGeneralView = (props: WIGDetailGeneralViewProps) => {
	const { wigInfo } = props;
	const [showDialog, setShowDialog] = useState(false);
	const organizationalLabel = useTranslation({ id: 'wig.general.organizationalWIG' });
	const teamLabel = useTranslation({ id: 'wig.general.battleWIG' });
	const wigTypeLabel = wigInfo.isOrganizational ? organizationalLabel : teamLabel;
	const renderSubtitle = () => {
		return (
			<div className="flex flex-row">
				{wigInfo.dueDate && (
					<>
						<span className="text-500">{<FormattedDate value={wigInfo.dueDate} />}</span>
						<span className="text-500 mx-2">-</span>
					</>
				)}
				<span className="text-500">{wigTypeLabel}</span>
			</div>
		);
	};
	const openEditDialog = () => {
		setShowDialog(true);
	};

	const closeEditDialog = () => {
		setShowDialog(false);
	};

	return (
		<>
			<Card
				className="wig-detail"
				pt={{
					body: { className: 'px-0' },
				}}
				style={{ background: 'none', boxShadow: 'none' }}
				title={<CardEditableHeader text={wigInfo.name} hoverSelector=".wig-detail" onEdit={openEditDialog} />}
				subTitle={renderSubtitle()}
			>
				{wigInfo.description && <span className="text-xl">{wigInfo.description}</span>}
			</Card>
			<WIGFormContainer open={showDialog} WIG={wigInfo} mode="edit" onClose={closeEditDialog} />
		</>
	);
};
