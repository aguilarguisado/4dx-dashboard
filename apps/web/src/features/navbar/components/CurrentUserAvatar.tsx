import { useAuth } from '@/auth';

import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';
import { useEffect, useState } from 'react';

export type CurrentUserAvatarProps = {
	enableTooltip?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export const CurrentUserAvatar = ({ enableTooltip, onClick }: CurrentUserAvatarProps = {}) => {
	const [label, setLabel] = useState<string>('');
	const { user } = useAuth();
	useEffect(() => {
		if (user) {
			const name = user.name || user.email || '';
			const initials = name
				.split(' ')
				.map((part) => part[0])
				.join('')
				.slice(0, 2);
			setLabel(initials);
		}
	}, [user]);

	return (
		<>
			{enableTooltip && <Tooltip target=".current-user-avatar" />}
			<Avatar
				onClick={onClick}
				data-pr-tooltip={user?.name ?? ''}
				data-pr-position="bottom"
				className="current-user-avatar"
				label={label}
				shape="circle"
			/>
		</>
	);
};
