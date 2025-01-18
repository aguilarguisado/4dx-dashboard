import { useTranslation } from '@/hooks/UseTranslation';
import { FormMode } from '@/types/forms';

import { Button } from 'primereact/button';

export type BaseFormFooterProps = {
	mode: FormMode;
	onCancel: () => void;
	onSubmit: () => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	neutralComponent?: React.ReactNode;
};

export type FormFooterProps = Omit<BaseFormFooterProps, 'neutralComponent'> & {
	isLoadingDelete?: boolean;
	onDelete?: () => void;
};
export const FormFooter = (props: FormFooterProps) => {
	const { onDelete, isLoadingDelete, ...baseProps } = props;
	if (isLoadingDelete) {
		baseProps.isDisabled = true;
	}
	const deleteLabel = useTranslation({ id: 'action.delete' });
	const disabled = isLoadingDelete || baseProps.isDisabled || baseProps.isLoading;
	const neutralComponent = (
		<>
			{baseProps.mode === 'edit' && onDelete && (
				<Button
					label={deleteLabel}
					icon="pi pi-trash"
					onClick={onDelete}
					disabled={disabled}
					loading={isLoadingDelete}
					className="p-button-danger"
				/>
			)}
		</>
	);

	return <BaseFormFooter neutralComponent={neutralComponent} {...baseProps} />;
};

export const BaseFormFooter = (props: BaseFormFooterProps) => {
	const { isDisabled, isLoading, neutralComponent = <></>, mode, onCancel, onSubmit } = props;
	const positiveActionId = mode === 'create' ? 'action.create' : 'action.save';
	const positiveLabel = useTranslation({ id: positiveActionId });
	const negativeLabel = useTranslation({ id: 'action.cancel' });
	const disabled = isLoading || isDisabled;
	return (
		<div className="flex flex-row justify-content-between">
			<div>{neutralComponent}</div>
			<div>
				<Button label={negativeLabel} onClick={onCancel} disabled={disabled} className="p-button-text" />
				<Button
					label={positiveLabel}
					icon="pi pi-check"
					disabled={disabled}
					loading={isLoading}
					onClick={onSubmit}
					autoFocus
				/>
			</div>
		</div>
	);
};
