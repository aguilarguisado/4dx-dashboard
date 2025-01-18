import { useEffect, useState } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
type Breakpoints = { [key in Breakpoint]: number };

// TODO: Remove harcoded and use theme breakpoints
const breakpoints: Breakpoints = {
	sm: 600,
	md: 960,
	lg: 1280,
	xl: 1920,
};

export const useBreakpoint = () => {
	const getBreakpoint = (width: number): Breakpoint => {
		if (width < breakpoints.sm) return 'sm';
		else if (width >= breakpoints.sm && width < breakpoints.md) return 'md';
		else if (width >= breakpoints.md && width < breakpoints.lg) return 'lg';
		else return 'xl';
	};

	const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint(window.innerWidth));

	useEffect(() => {
		const handleResize = () => {
			setBreakpoint(getBreakpoint(window.innerWidth));
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const breakpointIsAbove = (queryBreakpoint: Breakpoint): boolean => {
		const width = window.innerWidth;
		return width >= breakpoints[queryBreakpoint];
	};

	const breakpointIsBelow = (queryBreakpoint: Breakpoint): boolean => {
		const width = window.innerWidth;
		return width < breakpoints[queryBreakpoint];
	};

	return { breakpoint, breakpointIsAbove, breakpointIsBelow };
};
