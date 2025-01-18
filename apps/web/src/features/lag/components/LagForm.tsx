import { ErrorMessage } from '@/components/ErrorMessage';
import { InputTextControl } from '@/components/forms/controls/InputTextControl';
import { FormFooter } from '@/components/forms/FormFooter';
import { ScoreboardFormContextType, ScoreboardFormLayout, ScoreboardFormProvider } from '@/features/scoreboard';
import { addLag, removeLag, updateLag } from '@/features/wig';
import { useTranslation } from '@/hooks/UseTranslation';
import { parseApiError, trpc } from '@/lib/trpc';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { FormMode } from '@/types/forms';

import { zodResolver } from '@hookform/resolvers/zod';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { ReactNode, useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CreateLagDTO, CreateLagDTOSchema } from 'server/src/wig/data/dtos/CreateLagDTO';
import { ScoreboardDTO } from 'server/src/wig/data/dtos/ScoreboardDTO';
import { UpdateLagDTO, UpdateLagDTOSchema } from 'server/src/wig/data/dtos/UpdateLagDTO';
import { LagMeasurement } from 'server/src/wig/domain/types/LagMeasurement';
import { Scoreboard } from 'server/src/wig/domain/types/Scoreboard';

type LagFormContainerProps = {
	mode: FormMode;
	launcher?: ReactNode;
	lagId?: string;
	open?: boolean;
	onClose?: () => void;
};

export const LagFormContainer = ({ mode = 'create', launcher, lagId, open, onClose }: LagFormContainerProps) => {
	const dispatch = useAppDispatch();
	const wig = useAppSelector((state) => state.wigDetail.wig);
	const wigId = wig?.id;
	if (!wigId) {
		throw new Error('LagFormContainer must be used within a WIG context');
	}

	if (mode === 'edit' && !lagId) {
		throw new Error('LagId is required in edit mode');
	}

	const lag = wig.lags?.find((lag) => lag.id === lagId);
	if (!lag && mode === 'edit') {
		throw new Error('Lag not found');
	}
	const defaultValues: CreateLagDTO = { wigId, title: '' };
	const scoreboard: ScoreboardDTO | undefined = lag?.scoreboard
		? { id: lag.scoreboard.id, visualizationType: lag.scoreboard.visualizationType, config: lag.scoreboard.config }
		: undefined;
	const values = lag ? { ...lag, scoreboard, wigId } : defaultValues;
	const [showDialog, setShowDialog] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const formMethods = useForm<CreateLagDTO | UpdateLagDTO>({
		resolver: zodResolver(mode == 'create' ? CreateLagDTOSchema : UpdateLagDTOSchema),
		defaultValues: values,
	});

	const { trigger, getValues, reset } = formMethods;

	const { mutateAsync: addLagCall, isLoading: addLoading } = trpc.wig.addLag.useMutation();
	const { mutateAsync: updateLagCall, isLoading: updateLoading } = trpc.wig.updateLag.useMutation();
	const { mutateAsync: deleteLagCall, isLoading: deleteLoading } = trpc.wig.deleteLag.useMutation();
	const isSubmitting = addLoading || updateLoading;

	const headerId = mode === 'create' ? 'lag.create' : 'lag.edit';

	useEffect(() => {
		if (open) {
			setShowDialog(true);
		}
	}, [open]);

	const hideDialog = () => {
		setShowDialog(false);
		reset();
		setError(null);
		onClose?.();
	};

	const submitForm = async () => {
		const isValid = await trigger();
		if (isValid) {
			onSubmit(getValues());
		}
	};

	const onSubmit = async (data: CreateLagDTO | UpdateLagDTO) => {
		setError(null);
		try {
			if (mode === 'edit') {
				const { id } = lag as LagMeasurement;
				const updatedLag = await updateLagCall({ ...data, id, wigId });
				dispatch(updateLag(updatedLag));
			} else {
				const newLag = await addLagCall({ ...data, wigId });
				dispatch(addLag(newLag));
			}
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	const onDeleteLag = async () => {
		setError(null);
		try {
			const id = (lag as LagMeasurement).id;
			await deleteLagCall({ wigId, id });
			dispatch(removeLag(id));
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	const scoreboardFormContext: ScoreboardFormContextType = {
		namespace: 'scoreboard',
		mode,
		wigId,
		containerId: (lag as LagMeasurement)?.id,
		scoreboardId: lag?.scoreboard?.id,
		containerType: 'lag',
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
						mode={mode}
						isLoading={isSubmitting}
						isLoadingDelete={deleteLoading}
						onCancel={hideDialog}
						onSubmit={submitForm}
						onDelete={onDeleteLag}
					/>
				}
				onHide={hideDialog}
			>
				<>
					{error && <ErrorMessage message={parseApiError(error)} />}
					<FormProvider {...formMethods}>
						<ScoreboardFormProvider value={scoreboardFormContext}>
							<form>
								<LagFormLayout />
							</form>
						</ScoreboardFormProvider>
					</FormProvider>
				</>
			</Dialog>
		</>
	);
};

const LagFormLayout = () => {
	const [addScoreboard, setAddScoreboard] = useState(false);
	const [scoreboardExists, setScoreboardExists] = useState(false);
	const header = useTranslation({ id: 'action.confirmation' });
	const warningRemoveMessage = useTranslation({ id: 'scoreboard.warning.remove' });

	const formContext = useFormContext();
	const { getValues, setValue } = formContext;

	const scoreboard = getValues('scoreboard') as Scoreboard | undefined;

	useEffect(() => {
		setScoreboardExists(!!scoreboard);
		setAddScoreboard(!!scoreboard);
	}, []);

	const toggleScoreboard = (enabled: boolean) => {
		setAddScoreboard(enabled);
		if (!enabled) {
			setValue('scoreboard', undefined);
		}
	};
	const showWarningBeforeRemovingScoreboard = (enabled: boolean) => {
		if (scoreboardExists && !enabled) {
			confirmDialog({
				message: warningRemoveMessage,
				header,
				icon: 'pi pi-exclamation-triangle',
				accept: () => toggleScoreboard(false),
			});
		} else {
			toggleScoreboard(enabled);
		}
	};

	return (
		<div>
			<InputTextControl name="title" label={{ id: 'app.field.title' }} />
			<InputTextControl name="subtitle" label={{ id: 'app.field.subtitle' }} />
			{!addScoreboard && (
				<span className="text-primary cursor-pointer" onClick={() => toggleScoreboard(true)}>
					<FormattedMessage id="lag.addScoreboard" />
				</span>
			)}
			{addScoreboard && (
				<span
					className="text-primary cursor-pointer"
					onClick={() => showWarningBeforeRemovingScoreboard(false)}
				>
					<FormattedMessage id="lag.removeScoreboard" />
				</span>
			)}
			{addScoreboard && <ScoreboardFormLayout />}
		</div>
	);
};
