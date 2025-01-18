import { FadeIn } from '@/components/animations/FadeIn';
import { ScoreboardComponent } from '@/features/scoreboard';
import { useTranslation } from '@/hooks/UseTranslation';

import { IntlMessageKeys } from 'i18n';
import { Card } from 'primereact/card';
import { HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import { WIG } from 'server/src/wig/domain/models/WIG';

export type WIGCardViewProps = HTMLAttributes<HTMLDivElement> & {
	wig: WIG;
	onClick?: () => void;
};

export const WIGCardView: React.FC<WIGCardViewProps> = ({
	wig,
	style = {},
	onClick,
	className = '',
}: WIGCardViewProps) => {
	const renderFooter = () => {
		return (
			<div className="flex justify-content-end">
				{wig.dueDate && (
					<FormattedMessage
						id="wig.view.dueDateLabel"
						values={{ dueDate: wig.dueDate.toLocaleDateString() }}
					/>
				)}
			</div>
		);
	};
	return (
		<FadeIn className={className} style={style}>
			<Card
				className={`cursor-pointer`}
				onClick={onClick}
				title={wig.name}
				subTitle={wig.description}
				footer={renderFooter()}
				style={style}
			>
				{wig.scoreboard && <ScoreboardComponent scoreboard={wig.scoreboard} style={{ height: '150px' }} />}
			</Card>
		</FadeIn>
	);
};

export const OrganizationCardViewPlaceHolder = ({ wig = {} }: { wig?: Partial<WIG> }) => {
	const defaults = {
		id: 'ID',
		name: 'wig.list.empty',
		description: 'wig.list.empty.description',
		isOrganizational: false,
		organizationId: 'ORGANIZATION',
	};

	const combinedWIG = { ...defaults, ...wig };

	combinedWIG.name = useTranslation({ id: combinedWIG.name as IntlMessageKeys }) || 'No WIG Set';
	combinedWIG.description =
		useTranslation({ id: combinedWIG.description as IntlMessageKeys }) || 'Set a WIG to get started';
	return <WIGCardView wig={combinedWIG} className="w-full h-full" style={{ opacity: 0.6, cursor: 'pointer' }} />;
};
