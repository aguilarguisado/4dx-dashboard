import { CurrentUserMenu } from './CurrentUserMenu';

import { WIGFormContainer } from '@/features/wig';
import { useTranslation } from '@/hooks/UseTranslation';

import { PrimeIcons } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PrimaryNavbar() {
	const homeLabel = useTranslation({ id: 'menu.home' });
	const createWIGLabel = useTranslation({ id: 'wig.create' });
	const [openCreateWIGForm, setOpenCreateWIGForm] = useState(false);
	const navigate = useNavigate();
	const successCallback = async (wigId: string) => {
		navigate(`/app/wig-detail/${wigId}`);
	};
	const items = [
		{
			label: homeLabel,
			icon: PrimeIcons.HOME,
		},
		{ label: createWIGLabel, icon: PrimeIcons.PLUS, command: () => setOpenCreateWIGForm(true) },
	];

	const start = <></>;

	const end = (
		<div className="flex align-items-center gap-2">
			<CurrentUserMenu />
		</div>
	);

	return (
		<div className="flex justify-content-center bg-white ">
			<Menubar className="max-page-width bg-white border-none" model={items} start={start} end={end} />
			<Suspense fallback={<div>Loading WIG Form...</div>}>
				<WIGFormContainer
					open={openCreateWIGForm}
					onCreate={successCallback}
					onClose={() => setOpenCreateWIGForm(false)}
					mode="create"
				/>
			</Suspense>
		</div>
	);
}
