import { EditButton } from './EditButton';

import { useHover } from '@/hooks/UseHover';
import { useTranslation } from '@/hooks/UseTranslation';

import { IntlObject } from 'i18n';

export type CardEditableHeaderProps = {
	hoverSelector: string;
	text: IntlObject | string;
	onEdit?: () => void;
};

export const CardEditableHeader = (props: CardEditableHeaderProps) => {
	const { text, hoverSelector, onEdit } = props;
	const { isHovered } = useHover(hoverSelector);
	const translatedText = useTranslation(text);
	return (
		<div className="flex flex-row align-items-center justify-content-between" style={{ minHeight: '46px' }}>
			<div>{translatedText}</div>
			{isHovered && <EditButton onEdit={onEdit} />}
		</div>
	);
};
