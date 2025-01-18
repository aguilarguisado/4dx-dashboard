import { useTranslation } from '@/hooks/UseTranslation';

import { IntlObject } from 'i18n';
import { Messages } from 'primereact/messages';
import { useEffect, useRef } from 'react';

export const ErrorMessage = ({ message }: { message?: IntlObject | string }) => {
	const translatedMessage = useTranslation(message);
	const msgs = useRef<Messages>(null);
	useEffect(() => {
		if (message) {
			msgs.current?.clear();
			msgs.current?.show({ severity: 'error', summary: translatedMessage, sticky: true });
		}
	}, [message]);

	if (!message) return <></>;
	return <Messages ref={msgs} />;
};
