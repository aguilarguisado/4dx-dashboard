import { useTranslation } from '@/hooks/UseTranslation';

import { motion } from 'framer-motion';

type TextType = 'title' | 'subtitle' | 'paragraph';

type TypewriteProps = {
	text: string;
	type?: TextType;
	precision?: 'char' | 'word';
	elementsStyle?: React.CSSProperties;
	className?: string;
};

export const Typewrite = (props: TypewriteProps) => {
	const { text, type, elementsStyle, className = '', precision = 'word' } = props;
	const delimiter = precision === 'char' ? '' : ' ';

	const elementStyleProps = buildElementStyleProps(type, elementsStyle);
	const translatedMessage = useTranslation(text);
	const parts = translatedMessage?.split(delimiter) || [];
	return (
		<div className={`gap-2 ${className}`}>
			{parts.map((el, i) => (
				<motion.span
					style={elementStyleProps}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.25,
						delay: i / 10,
					}}
					key={i}
				>
					{el}
					{delimiter}
				</motion.span>
			))}
		</div>
	);
};

const buildElementStyleProps = (type?: TextType, style: React.CSSProperties = {}) => {
	if (!type) return style;
	switch (type) {
		case 'title':
			return {
				fontSize: '2rem',
				fontWeight: 'bold',
				...style,
			};
		case 'subtitle':
			return {
				fontSize: '1.25rem',
				fontWeight: 'normal',
				...style,
			};
		case 'paragraph':
			return {
				fontSize: '1rem',
				fontWeight: 'normal',
				...style,
			};
	}
};
