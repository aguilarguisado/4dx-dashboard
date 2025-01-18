import { useTranslation } from './UseTranslation';

import { parseZodMessageError } from 'i18n';

export const useZodTranslation = (message?: string) => {
	return useTranslation(parseZodMessageError(message));
};
