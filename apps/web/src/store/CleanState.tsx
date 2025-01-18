import { useAppDispatch } from './store';

import { cleanState } from '@/features/wig';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const CleanState = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(cleanState());
	}, [location.pathname]);

	return <>{children}</>;
};
