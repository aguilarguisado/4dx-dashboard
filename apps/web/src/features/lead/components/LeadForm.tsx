import { ErrorMessage } from '@/components/ErrorMessage';
import { InputTextControl } from '@/components/forms/controls/InputTextControl';
import { FormFooter } from '@/components/forms/FormFooter';
import { ScoreboardFormContextType, ScoreboardFormLayout, ScoreboardFormProvider } from '@/features/scoreboard';
import { addLead, removeLead, updateLead } from '@/features/wig';
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
import { CreateLeadDTO, CreateLeadDTOSchema } from 'server/src/wig/data/dtos/CreateLeadDTO';
import { ScoreboardDTO } from 'server/src/wig/data/dtos/ScoreboardDTO';
import { UpdateLeadDTO, UpdateLeadDTOSchema } from 'server/src/wig/data/dtos/UpdateLeadDTO';
import { LeadMeasurement } from 'server/src/wig/domain/types/LeadMeasurement';
import { Scoreboard } from 'server/src/wig/domain/types/Scoreboard';

type LeadFormContainerProps = {
	mode: FormMode;
	launcher?: ReactNode;
	leadId?: string;
	open?: boolean;
	onClose?: () => void;
};

export const LeadFormContainer = ({ mode = 'create', launcher, leadId, open, onClose }: LeadFormContainerProps) => {
	const dispatch = useAppDispatch();
	const wig = useAppSelector((state) => state.wigDetail.wig);
	const wigId = wig?.id;
	if (!wigId) {
		throw new Error('LeadFormContainer must be used within a WIG context');
	}

	if (mode === 'edit' && !leadId) {
		throw new Error('LeadId is required in edit mode');
	}

	const lead = wig.leads?.find((lead) => lead.id === leadId);
	if (!lead && mode === 'edit') {
		throw new Error('Lead not found');
	}

	const defaultValues: CreateLeadDTO = { wigId, name: '' };
	const scoreboard: ScoreboardDTO | undefined = lead?.scoreboard
		? {
				id: lead.scoreboard.id,
				visualizationType: lead.scoreboard.visualizationType,
				config: lead.scoreboard.config,
			}
		: undefined;
	const values = lead ? { ...lead, scoreboard, wigId } : defaultValues;

	const [showDialog, setShowDialog] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const formMethods = useForm<CreateLeadDTO | UpdateLeadDTO>({
		resolver: zodResolver(mode == 'create' ? CreateLeadDTOSchema : UpdateLeadDTOSchema),
		defaultValues: values,
	});

	const { trigger, getValues, reset } = formMethods;

	const { mutateAsync: addLeadCall, isLoading: addLoading } = trpc.wig.addLead.useMutation();
	const { mutateAsync: updateLeadCall, isLoading: updateLoading } = trpc.wig.updateLead.useMutation();
	const { mutateAsync: deleteLeadCall, isLoading: deleteLoading } = trpc.wig.deleteLead.useMutation();
	const isSubmitting = addLoading || updateLoading;

	const headerId = mode === 'create' ? 'lead.create' : 'lead.edit';

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

	const onSubmit = async (data: CreateLeadDTO | UpdateLeadDTO) => {
		setError(null);
		try {
			if (mode === 'edit') {
				const { id } = lead as LeadMeasurement;
				const updatedLead = await updateLeadCall({ ...data, id, wigId });
				dispatch(updateLead(updatedLead));
			} else {
				const newLead = await addLeadCall({ ...data, wigId });
				dispatch(addLead(newLead));
			}
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	const onDeleteLead = async () => {
		setError(null);
		try {
			const id = (lead as LeadMeasurement).id;
			await deleteLeadCall({ wigId, id });
			dispatch(removeLead(id));
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	const scoreboardFormContext: ScoreboardFormContextType = {
		namespace: 'scoreboard',
		mode,
		wigId,
		containerId: (lead as LeadMeasurement)?.id,
		scoreboardId: lead?.scoreboard?.id,
		containerType: 'lead',
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
						onDelete={onDeleteLead}
					/>
				}
				onHide={hideDialog}
			>
				<>
					{error && <ErrorMessage message={parseApiError(error)} />}
					<FormProvider {...formMethods}>
						<ScoreboardFormProvider value={scoreboardFormContext}>
							<form>
								<LeadFormLayout />
							</form>
						</ScoreboardFormProvider>
					</FormProvider>
				</>
			</Dialog>
		</>
	);
};
// TODO: translate transform lag to lead
const LeadFormLayout = () => {
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
			<InputTextControl name="name" label={{ id: 'app.field.name' }} />
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
