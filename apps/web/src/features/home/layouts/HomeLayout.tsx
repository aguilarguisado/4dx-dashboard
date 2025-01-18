import { trpc } from '@/lib/trpc';

import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { lazy, Suspense, useEffect, useState } from 'react';
import { WIG } from 'server/src/wig/domain/models/WIG';

// Lazy-loaded components
const WIGListView = lazy(() => import('../components/WIGListView').then((module) => ({ default: module.WIGListView })));
const HomeHeader = lazy(() => import('../components/HomeHeader').then((module) => ({ default: module.HomeHeader })));

export const HomeLayout = () => {
	const { data, isLoading } = trpc.wig.getWIGs.useQuery();
	const [organizationalWIG, setOrganizationalWIG] = useState<WIG | null>();
	const [battleWIGs, setBattleWIGs] = useState<WIG[]>([]);

	useEffect(() => {
		if (data) {
			const orgWIGS = data?.filter((wig) => wig.isOrganizational);
			if (orgWIGS.length > 0) {
				setOrganizationalWIG(orgWIGS[0]);
			} else {
				setOrganizationalWIG(null);
			}
			setBattleWIGs(data?.filter((wig) => !wig.isOrganizational));
		}
	}, [data]);

	return (
		<div className="w-full grid-nogutter">
			<Suspense fallback={<div>Loading HomeHeader...</div>}>
				<HomeHeader wig={organizationalWIG} />
			</Suspense>
			<div className="w-full flex flex-row justify-content-center">
				<div className="app-box-container">
					<Suspense fallback={<div>Loading WIGs...</div>}>
						<WIGListView wigs={battleWIGs} isLoading={isLoading} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

// TODO: Replace with real profile info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MockProfileInfo = () => {
	return (
		<>
			<h3>Review your profile</h3>
			<div className="mb-3">
				<Tag value="Rockstar!" icon="pi pi-star" severity="success" />
			</div>
			<div className="mb-3">
				<h5>Commitment</h5>
				<ProgressBar value={40} showValue={true} />
			</div>
			{/* Additional metrics */}
			<div className="mb-3">
				<h5>Influence</h5>
				<ProgressBar value={75} showValue={true} color="var(--green-500)" />
			</div>
			<div className="mb-3">
				<h5>Execution</h5>
				<ProgressBar value={85} showValue={true} color="var(--blue-500)" />
			</div>
			<div className="mb-3">
				<h5>Strategy</h5>
				<ProgressBar value={65} showValue={true} color="var(--purple-500)" />
			</div>
		</>
	);
};
