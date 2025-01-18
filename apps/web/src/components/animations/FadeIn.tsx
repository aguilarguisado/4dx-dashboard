import { motion } from 'framer-motion';
import { HTMLAttributes } from 'react';

type FadeInProps = HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
};

export const FadeIn = (props: FadeInProps) => {
	const { children, className } = props;
	return (
		<motion.div
			initial={{ opacity: 0.2, scale: 1 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				duration: 0.6,
				delay: 0,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
};
