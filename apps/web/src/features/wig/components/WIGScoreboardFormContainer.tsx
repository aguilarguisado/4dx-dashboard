import { setScoreboard } from '../store/features/detailSlice';

import { ErrorMessage } from '@/components/ErrorMessage';
import { FormFooter } from '@/components/forms/FormFooter';
import { ScoreboardFormContextType, ScoreboardFormLayout, ScoreboardFormProvider } from '@/features/scoreboard';
import { parseApiError, trpc } from '@/lib/trpc';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { FormMode } from '@/types/forms';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from 'primereact/dialog';
import { ReactNode, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { WIGScoreboardDTO, WIGScoreboardDTOSchema } from 'server/src/wig/data/dtos/WIGScoreboardDTO';

type WIGScoreboardFormContainerProps = {
	mode: FormMode;
	launcher?: ReactNode;
	open?: boolean;
	onClose?: () => void;
};

export const WIGScoreboardFormContainer = ({
	mode = 'create',
	launcher,
	open,
	onClose,
}: WIGScoreboardFormContainerProps) => {
	const [showDialog, setShowDialog] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const wig = useAppSelector((state) => state.wigDetail.wig);
	if (!wig) {
		throw new Error('WIGScoreboardFormContainer must be used within a WIG context');
	}
	const wigId = wig?.id;
	const scoreboard = wig?.scoreboard;
	const dispatch = useAppDispatch();
	const values = scoreboard
		? { id: scoreboard.id, visualizationType: scoreboard.visualizationType, config: scoreboard.config, wigId }
		: { wigId };

	const formMethods = useForm<WIGScoreboardDTO>({
		resolver: zodResolver(WIGScoreboardDTOSchema),
		defaultValues: values,
	});

	const { trigger, getValues } = formMethods;

	const { mutateAsync: createScoreboard, isLoading: createLoading } = trpc.wig.createScoreboard.useMutation();
	const { mutateAsync: updateScoreboard, isLoading: updateLoading } = trpc.wig.updateScoreboard.useMutation();
	const { mutateAsync: deleteScoreboard, isLoading: deleteLoading } = trpc.wig.deleteScoreboard.useMutation();

	const isSubmitting = createLoading || updateLoading;
	if (mode === 'edit' && !scoreboard) {
		throw new Error('Scoreboard is required in edit mode');
	}

	const headerId = mode === 'create' ? 'scoreboard.create' : 'scoreboard.edit';

	useEffect(() => {
		if (open) {
			setShowDialog(true);
		}
	}, [open]);

	const hideDialog = () => {
		setShowDialog(false);
		onClose?.();
	};

	const submitForm = async () => {
		const isValid = await trigger();
		if (isValid) {
			onSubmit(getValues());
		}
	};

	const onSubmit = async (data: WIGScoreboardDTO) => {
		setError(null);
		try {
			let wig;
			if (mode === 'edit') {
				wig = await updateScoreboard(data);
			} else {
				wig = await createScoreboard(data);
			}
			dispatch(setScoreboard({ containerType: 'wig', containerId: wigId, scoreboard: wig.scoreboard }));
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	const onDeleteScoreboard = async () => {
		setError(null);
		try {
			await deleteScoreboard({ wigId });
			dispatch(setScoreboard({ containerType: 'wig', containerId: wigId, scoreboard: undefined }));
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	const scoreboardFormContext: ScoreboardFormContextType = {
		mode,
		wigId,
		containerId: wigId,
		scoreboardId: scoreboard?.id,
		containerType: 'wig',
	};

	return (
		<>
			{launcher && (
				<div>
					<span
						onClick={() => {
							setShowDialog(true);
						}}
					>
						{launcher}
					</span>
				</div>
			)}
			<Dialog
				header={<FormattedMessage id={headerId} />}
				visible={showDialog}
				style={{ minWidth: '50vw' }}
				footer={
					<FormFooter
						isLoading={isSubmitting}
						isLoadingDelete={deleteLoading}
						mode={mode}
						onCancel={hideDialog}
						onSubmit={submitForm}
						onDelete={onDeleteScoreboard}
					/>
				}
				onHide={hideDialog}
			>
				<>
					{error && <ErrorMessage message={parseApiError(error)} />}
					<FormProvider {...formMethods}>
						<ScoreboardFormProvider value={scoreboardFormContext}>
							<ScoreboardFormLayout />
						</ScoreboardFormProvider>
					</FormProvider>
				</>
			</Dialog>
		</>
	);
};
