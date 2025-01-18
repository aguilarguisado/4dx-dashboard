// eslint-disable-next-line no-restricted-imports
import { WIGDetailGeneralView } from '../components/detail/WIGDetailGeneralView';
import { WIGDetailScoreboard } from '../components/detail/WIGDetailScoreboard';
import { WIGLagsView } from '../components/detail/WIGLagsView';
import { WIGLeadsView } from '../components/detail/WIGLeadsView';
import { WIGOptionsMenu } from '../components/detail/WIGOptionsMenu';
import { WIGSidenav } from '../components/detail/WIGSidenav';
import { setWigDetail } from '../store/features/detailSlice';

import { useBreakpoint } from '@/hooks/UseBreakpoint';
import { trpc } from '@/lib/trpc';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { Divider } from 'primereact/divider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type WIGDetailLayoutProps = {
	id: string;
};

export const WIGDetailLayout = ({ id }: WIGDetailLayoutProps) => {
	const navigate = useNavigate();
	const wigInfo = useAppSelector((state) => state.wigDetail.wig);
	const dispatch = useAppDispatch();
	const { data, isError, error } = trpc.wig.getWIG.useQuery({ id });
	const { breakpointIsAbove } = useBreakpoint();
	const isLargeLayout = breakpointIsAbove('md');

	if (isError && error.data?.code === 'NOT_FOUND') {
		navigate('/app/home');
	}

	useEffect(() => {
		if (data) {
			dispatch(setWigDetail(data));
		}
	}, [data]);

	return (
		<div className="inline-flex w-full">
			{wigInfo && (
				<div className="flex flex-column flex-1 mx-3 w-full">
					<div className="flex flex-row justify-content-end">
						{!isLargeLayout && <WIGOptionsMenu wigId={wigInfo.id} />}
					</div>
					<WIGDetailGeneralView wigInfo={wigInfo} />
					{wigInfo.scoreboard && <WIGDetailScoreboard />}
					{wigInfo.leads && <Divider />}
					<WIGLeadsView leads={wigInfo.leads || []} />
					<WIGLagsView lags={wigInfo.lags || []} />
				</div>
			)}
			{isLargeLayout && (
				<div className="flex flex-column" style={{ minWidth: '300px' }}>
					{wigInfo && <WIGSidenav wig={wigInfo} />}
				</div>
			)}
		</div>
	);
};
