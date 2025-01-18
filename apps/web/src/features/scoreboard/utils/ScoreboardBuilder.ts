export type TargetReferenceConfig = {
	target: number;
};

export const getTargetReferenceAnnotation = ({ target }: TargetReferenceConfig = { target: 100 }) => {
	const documentStyle = getComputedStyle(document.documentElement);
	return {
		targetReference: {
			type: 'line',
			yMin: target,
			yMax: target,
			borderColor: documentStyle.getPropertyValue('--primary-800'), // Line color
			borderWidth: 4, // Line width
		},
	};
};
