import { useEffect, useState } from 'react';

export const useHover = (selector: string) => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	useEffect(() => {
		const element = document.querySelector(selector);
		element?.addEventListener('mouseenter', handleMouseEnter);
		element?.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			element?.removeEventListener('mouseenter', handleMouseEnter);
			element?.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [selector]);

	return { isHovered };
};
