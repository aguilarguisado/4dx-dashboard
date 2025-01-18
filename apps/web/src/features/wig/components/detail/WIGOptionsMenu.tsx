import { WIGDeleteDialog } from './WIGDeleteDialog';
import { LagFormContainer } from '../../../lag/components/LagForm';
import { LeadFormContainer } from '../../../lead/components/LeadForm';
import { WIGScoreboardFormContainer } from '../WIGScoreboardFormContainer';

import { useTranslation } from '@/hooks/UseTranslation';

import { PrimeIcons } from 'primereact/api';
import { Menu } from 'primereact/menu';
import { SyntheticEvent, useRef, useState } from 'react';

export type WIGOptionsMenuProps = {
	wigId: string;
};

export const WIGOptionsMenu = (props: WIGOptionsMenuProps) => {
	const { wigId } = props;
	const menu = useRef<Menu>(null);
	const [openScoreboardForm, setOpenScoreboardForm] = useState(false);
	const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
	const [openLeadForm, setOpenLeadForm] = useState(false);
	const [openLagForm, setOpenLagForm] = useState(false);

	const title = useTranslation({ id: 'wig.management.title' });
	const createScoreboardLabel = useTranslation({ id: 'wig.management.createScoreboard' }) ?? '';
	const createLeadLabel = useTranslation({ id: 'wig.management.createLead' }) ?? '';
	const createLagLabel = useTranslation({ id: 'wig.management.createLag' }) ?? '';
	const deleteLabel = useTranslation({ id: 'wig.management.delete' }) ?? '';

	const items = [
		{
			label: title,
			items: [
				{
					label: createScoreboardLabel,
					icon: PrimeIcons.PLUS,
					command: () => setOpenScoreboardForm(true),
				},
				{
					label: createLeadLabel,
					icon: PrimeIcons.PLUS,
					command: () => setOpenLeadForm(true),
				},
				{
					label: createLagLabel,
					icon: PrimeIcons.PLUS,
					command: () => setOpenLagForm(true),
				},
				{
					label: deleteLabel,
					icon: PrimeIcons.TRASH,
					command: () => setOpenDeleteConfirmation(true),
				},
			],
		},
	];

	return (
		<>
			<Menu model={items} popup ref={menu} id="wig-option-menu" />
			<i
				className="pi pi-cog text-primary cursor-pointer"
				role="button"
				onClick={(event: SyntheticEvent<Element, Event>) => menu?.current?.toggle(event)}
				aria-controls="wig-option-menu"
				aria-haspopup
				aria-label="wig settings"
			/>
			<WIGScoreboardFormContainer
				mode="create"
				onClose={() => setOpenScoreboardForm(false)}
				open={openScoreboardForm}
			/>
			<LeadFormContainer mode="create" onClose={() => setOpenLeadForm(false)} open={openLeadForm} />
			<LagFormContainer mode="create" onClose={() => setOpenLagForm(false)} open={openLagForm} />
			<WIGDeleteDialog
				wigId={wigId}
				onHide={() => setOpenDeleteConfirmation(false)}
				open={openDeleteConfirmation}
			/>
		</>
	);
};
