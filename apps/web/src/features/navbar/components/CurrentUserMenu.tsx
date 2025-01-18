import { CurrentUserAvatar } from './CurrentUserAvatar';

import { useAuth } from '@/auth';
import { useTranslation } from '@/hooks/UseTranslation';

import { PrimeIcons } from 'primereact/api';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const CurrentUserMenu = () => {
	const menu = useRef<Menu>(null);
	const { logout } = useAuth();
	const navigate = useNavigate();
	const profileLabel = useTranslation({ id: 'menu.profile' });
	const logoutLabel = useTranslation({ id: 'menu.logout' });

	const items = [
		{
			label: profileLabel,
			items: [
				{
					label: logoutLabel,
					icon: PrimeIcons.SIGN_OUT,
					command: () => {
						logout();
						navigate('/login');
					},
				},
			],
		},
	];

	return (
		<>
			<Menu model={items} popup ref={menu} id="current-user-menu" />
			<CurrentUserAvatar
				onClick={(event) => menu?.current?.toggle(event)}
				aria-controls="current-user-menu"
				aria-haspopup
			/>
		</>
	);
};
