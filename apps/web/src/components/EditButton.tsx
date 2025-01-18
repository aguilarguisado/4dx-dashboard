import { FadeIn } from './animations/FadeIn';

export const EditButton = ({ onEdit }: { onEdit?: () => void }) => {
	return (
		<FadeIn>
			<i className="pi pi-pencil text-primary cursor-pointer" role="button" onClick={onEdit} />
		</FadeIn>
	);
};
