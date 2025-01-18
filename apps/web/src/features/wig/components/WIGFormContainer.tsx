import { WIGForm, WIGFormHandle } from './WIGForm';
import { setWigDetailGeneral } from '../store/features/detailSlice';

import { ErrorMessage } from '@/components/ErrorMessage';
import { BaseFormFooter } from '@/components/forms/FormFooter';
import { parseApiError, trpc } from '@/lib/trpc';
import { useAppDispatch } from '@/store/store';
import { FormMode } from '@/types/forms';

import { Dialog } from 'primereact/dialog';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateWIGDTO } from 'server/src/wig/data/dtos/CreateWIGDTO';
import { UpdateGeneralSectionDTO } from 'server/src/wig/data/dtos/UpdateGeneralSectionDTO';
import { CreateWIG } from 'server/src/wig/domain/types/CreateWIG';

type WIGFormContainerProps = {
	mode: FormMode;
	launcher?: ReactNode;
	WIG?: CreateWIGDTO | UpdateGeneralSectionDTO;
	open?: boolean;
	onCreate?: (wigId: string) => Promise<void>;
	onClose?: () => void;
};

export const WIGFormContainer = ({
	launcher,
	WIG,
	open,
	mode = 'create',
	onCreate,
	onClose,
}: WIGFormContainerProps) => {
	const [showDialog, setShowDialog] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const formComponent = useRef<WIGFormHandle>(null);
	const dispatch = useAppDispatch();

	const { mutateAsync: createWIG, isLoading: createLoading } = trpc.wig.createWIG.useMutation();
	const { mutateAsync: updateWIG, isLoading: updateLoading } = trpc.wig.updateWIG.useMutation();
	const isSubmitting = createLoading || updateLoading;
	const headerId = mode === 'create' ? 'wig.create' : 'wig.edit';

	useEffect(() => {
		if (open) {
			setShowDialog(true);
		}
	}, [open]);

	const hideDialog = () => {
		setShowDialog(false);
		onClose?.();
	};

	const submitForm = () => {
		formComponent.current?.submit();
	};

	const onSubmitForm = async (data: CreateWIG | UpdateGeneralSectionDTO) => {
		setError(null);
		try {
			let id;
			if (mode === 'edit') {
				id = (WIG as UpdateGeneralSectionDTO).id;
				await updateWIG({ ...data, id });
				dispatch(setWigDetailGeneral(data));
			} else {
				const { id: responseId } = await createWIG(data);
				id = responseId;
				await onCreate?.(id);
			}
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	return (
		<>
			{launcher && <div onClick={() => setShowDialog(true)}>{launcher}</div>}
			<Dialog
				header={<FormattedMessage id={headerId} />}
				visible={showDialog}
				style={{ minWidth: '50vw' }}
				footer={
					<BaseFormFooter mode={mode} isLoading={isSubmitting} onCancel={hideDialog} onSubmit={submitForm} />
				}
				onHide={hideDialog}
			>
				<>
					{error && <ErrorMessage message={parseApiError(error)} />}
					<WIGForm ref={formComponent} mode={mode} values={WIG} onSubmit={onSubmitForm} />
				</>
			</Dialog>
		</>
	);
};
