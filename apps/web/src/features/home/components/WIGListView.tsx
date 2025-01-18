import { OrganizationCardViewPlaceHolder, WIGCardView } from './WIGCardView';

import { WIGFormContainer } from '@/features/wig';

import { HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { WIG } from 'server/src/wig/domain/models/WIG';

type WIGListViewProps = HTMLAttributes<HTMLDivElement> & {
	wigs?: WIG[];
	isLoading?: boolean;
};

export const WIGListView: React.FC<WIGListViewProps> = (props: WIGListViewProps) => {
	const { wigs, isLoading = false, className = '' } = props;
	const navigate = useNavigate();
	const goToWIGDetail = (id: string) => {
		return navigate(`/app/wig-detail/${id}`);
	};
	const isEmpty = !wigs?.length;

	if (isLoading) {
		return (
			<div className="w-full">
				<FormattedMessage id="app.loading" />
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="grid">
				{isEmpty && (
					<WIGFormContainer
						launcher={
							<div className="col-12">
								<OrganizationCardViewPlaceHolder />
							</div>
						}
						onCreate={(id: string) => {
							return Promise.resolve(goToWIGDetail(id));
						}}
						mode="create"
					/>
				)}
				{!isEmpty &&
					wigs.map((wig, index) => (
						<WIGCardView
							className="col-12 md:col-6 lg:col-4"
							wig={wig}
							key={index}
							onClick={() => goToWIGDetail(wig.id)}
						/>
					))}
			</div>
		</div>
	);
};
