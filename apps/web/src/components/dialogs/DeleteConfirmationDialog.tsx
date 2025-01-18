import { IntlObject } from 'i18n';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export type DeleteConfirmationDialogProps = {
	launcher?: React.ReactNode;
	message?: IntlObject;
	open?: boolean;
	onAccept?: () => void;
	onReject?: () => void;
};

export const DeleteConfirmationDialog = (props: DeleteConfirmationDialogProps) => {
	const { launcher, message, open, onAccept, onReject } = props;
	const intl = useIntl();
	const [visible, setVisible] = useState(false);
	const messageText = message
		? intl.formatMessage(message)
		: intl.formatMessage({ id: 'delete.confirmation.message' });
	const headerText = intl.formatMessage({ id: 'delete.confirmation.title' });

	useEffect(() => {
		if (open) {
			setVisible(true);
		}
	}, [open]);

	const onAcceptClicked = () => {
		onAccept?.();
		onHide();
	};

	const onRejectClicked = () => {
		onReject?.();
		onHide();
	};

	const onHide = () => {
		setVisible(false);
	};
	return (
		<>
			<ConfirmDialog
				visible={visible}
				onHide={() => setVisible(false)}
				message={messageText}
				header={headerText}
				accept={onAcceptClicked}
				reject={onRejectClicked}
			/>
			{launcher && <div onClick={() => setVisible(true)}>{launcher}</div>}
		</>
	);
};
