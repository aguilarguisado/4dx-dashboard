import { IntlObject, localeEnUS, localeESES } from 'i18n';

export const availableTranslations = {
	en: localeEnUS.messages,
	es: localeESES.messages,
};

export const parseTRPCError = (error: { json?: { message?: string } }): IntlObject => {
	// Know if error.json.message is a string or an serialized object
	const message = error?.json?.message;
	if (!message) return { id: 'error.unknown' };
	return parseString(message);
};

const parseString = (input: string) => {
	try {
		return JSON.parse(input);
	} catch (error) {
		return input;
	}
};
