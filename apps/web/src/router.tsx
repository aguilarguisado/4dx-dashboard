import { CleanState } from './store/CleanState';

import { lazy, Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Lazy-loaded components
const FrameLayout = lazy(() => import('./layouts/FrameLayout').then((module) => ({ default: module.FrameLayout })));
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const WIGDetailPage = lazy(() => import('./pages/WIGDetailPage').then((module) => ({ default: module.WIGDetailPage })));

export const initRouter = () => {
	return (
		<Router>
			<Suspense fallback={<div>Loading...</div>}>
				<CleanState>
					<Routes location={location} key={location.pathname}>
						<Route path="/app" element={<FrameLayout />}>
							<Route path="home" element={<HomePage />} />
							<Route path="wig-detail/:id" element={<WIGDetailPage />} />
						</Route>
						<Route path="login" element={<LoginPage />} />
						<Route path="*" element={<Navigate to="/app/home" />} />
					</Routes>
				</CleanState>
			</Suspense>
		</Router>
	);
};
