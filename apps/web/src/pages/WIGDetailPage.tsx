import { WIGDetailLayout } from '@/features/wig';
import { useTranslation } from '@/hooks/UseTranslation';

import { BreadCrumb } from 'primereact/breadcrumb';
import { useParams } from 'react-router-dom';

export const WIGDetailPage = () => {
	const { id } = useParams();

	return (
		<div className="flex flex-column mt-3 gap-2 app-box-container">
			<BreadCrumbDemo />
			{id && <WIGDetailLayout id={id} />}
		</div>
	);
};

// TODO: remove demo. generic breadcrumb?
const BreadCrumbDemo = () => {
	const dashboardLabel = useTranslation({ id: 'breadcrumb.dashboard' });
	const wigDetailLabel = useTranslation({ id: 'breadcrumb.wigDetail' });
	const items = [{ label: dashboardLabel, url: '/app/home' }, { label: wigDetailLabel }];

	const home = { icon: 'pi pi-home', url: '/app/home' };

	return <BreadCrumb model={items} home={home} style={{ background: 'none', borderWidth: 0 }} />;
};
