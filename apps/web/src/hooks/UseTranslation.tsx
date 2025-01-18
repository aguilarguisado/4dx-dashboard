import { IntlObject } from 'i18n';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export const useTranslation = (message?: IntlObject | string) => {
	const intl = useIntl();
	const msg = useMemo(() => {
		return !message || typeof message === 'string' ? message : intl.formatMessage(message, message.values);
	}, [message, intl]);
	return msg;
};
