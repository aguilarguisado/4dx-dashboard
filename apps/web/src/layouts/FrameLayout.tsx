import { PrimaryNavbar } from '../features/navbar/components/PrimaryNavbar';

import { ProtectedRoute } from '@/components/ProtectedRoute';

import { Outlet } from 'react-router-dom';

export const FrameLayout = () => {
	return (
		<div className="w-full">
			<ProtectedRoute>
				<div className="flex flex-column w-full">
					<PrimaryNavbar />
					<div className="flex justify-content-center w-full">
						<Outlet />
					</div>
				</div>
			</ProtectedRoute>
		</div>
	);
};
