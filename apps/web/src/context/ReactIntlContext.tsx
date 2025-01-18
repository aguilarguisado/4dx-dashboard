import { createContext, ReactNode, useMemo, useState } from 'react';
import { CustomFormats, IntlProvider } from 'react-intl';

const formats: CustomFormats = {
	date: {
		long: {
			month: 'long',
			day: '2-digit',
			year: 'numeric',
		},
	},
};

const IntlContext = createContext<{
	locale: string;
	messages: Record<string, string>;
	changeLocale: (language: string) => void;
}>({ locale: 'en', messages: {}, changeLocale: () => {} });

const ReactIntlContext = ({
	defaultLocale = 'en',
	translations,
	children,
}: {
	defaultLocale?: string;
	translations: Record<string, Record<string, string>>;
	children: ReactNode;
}) => {
	let language = navigator.language.split(/[-_]/)[0];

	if (!translations[language]) {
		language = defaultLocale;
	}

	const [locale, setLocale] = useState(language);
	const [messages, setMessages] = useState(translations[language]);

	const changeLocale = (language: string) => {
		setLocale(language);
		let messages = translations[language];

		if (!messages) {
			messages = translations[defaultLocale];
		}
		setMessages(messages);
	};

	const contextValue = useMemo(
		() => ({
			locale,
			messages,
			changeLocale,
		}),
		[locale, messages, changeLocale],
	);

	return (
		<IntlContext.Provider value={contextValue}>
			<IntlProvider
				key={locale}
				locale={locale}
				messages={messages}
				defaultLocale={defaultLocale}
				formats={formats}
			>
				{children}
			</IntlProvider>
		</IntlContext.Provider>
	);
};

export { IntlContext, ReactIntlContext };
