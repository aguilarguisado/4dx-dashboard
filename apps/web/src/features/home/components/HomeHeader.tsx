import { OrganizationCardViewPlaceHolder, WIGCardView } from './WIGCardView';

import { Typewrite } from '@/components/animations/Typewrite';
import { WIGFormContainer } from '@/features/wig';
import { useTranslation } from '@/hooks/UseTranslation';

import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { WIG } from 'server/src/wig/domain/models/WIG';

export type HomeLayoutProps = {
	wig?: WIG | null;
};

export const HomeHeader: React.FC<HomeLayoutProps> = ({ wig }: HomeLayoutProps) => {
	const navigate = useNavigate();
	const headerTitle = useTranslation({ id: 'home.header.title' }) || '';
	const headerSubtitle = useTranslation({ id: 'home.header.subtitle' }) || '';
	const goToDetail = (id: string) => {
		return navigate(`/app/wig-detail/${id}`);
	};

	return (
		<div
			className="flex flex-row w-full justify-content-center"
			style={{
				background: 'linear-gradient(135deg, #0078D4, #00BCF2)',
				color: 'white',
				minHeight: '320px',
			}}
		>
			<div className="flex flex-row align-items-center justify-content-between px-4 app-box-container">
				<div className="flex flex-column col-4">
					<Typewrite type="title" text={headerTitle} />
					<Typewrite type="subtitle" text={headerSubtitle} />
				</div>
				{wig && (
					<div className="col-6">{wig && <WIGCardView wig={wig} onClick={() => goToDetail(wig.id)} />}</div>
				)}
				{wig === null && (
					<div className="col-6">
						<h3 className="text-center">
							<FormattedMessage id="home.header.organizationWIG.header.empty" />
						</h3>
						<WIGFormContainer
							launcher={
								<OrganizationCardViewPlaceHolder
									wig={{
										name: 'home.header.organizationWIG.title',
										description: 'home.header.organizationWIG.description',
									}}
								/>
							}
							WIG={{ name: '', description: '', isOrganizational: true }}
							mode="create"
							onCreate={(id: string) => {
								return Promise.resolve(goToDetail(id));
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
