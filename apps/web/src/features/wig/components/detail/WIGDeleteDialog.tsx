import { DeleteConfirmationDialog } from '@/components/dialogs/DeleteConfirmationDialog';
import { trpc } from '@/lib/trpc';

import { HTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type WIGDeleteDialogProps = HTMLAttributes<HTMLDivElement> & {
	wigId: string;
	launcher?: ReactNode;
	open?: boolean;
	onHide?: () => void;
};

export const WIGDeleteDialog = (props: WIGDeleteDialogProps) => {
	const { wigId, launcher, open, onHide } = props;
	const navigate = useNavigate();
	const { mutateAsync: deleteWIG } = trpc.wig.deleteWIG.useMutation();
	const onAccept = async () => {
		try {
			await deleteWIG({ id: wigId });
			navigate('/wig');
		} catch {
			// TODO: Show error
		}
		onHide?.();
	};

	const onReject = () => {
		onHide?.();
	};

	return <DeleteConfirmationDialog launcher={launcher} open={open} onAccept={onAccept} onReject={onReject} />;
};
