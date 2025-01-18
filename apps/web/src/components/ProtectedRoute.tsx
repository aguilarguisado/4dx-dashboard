import { useAuth } from '@/auth';

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
	children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isInitialized, user } = useAuth();

	if (!isInitialized) return <>Loading...</>;
	if (!user) return <Navigate to="/login" />;
	return <>{children}</>;
}
