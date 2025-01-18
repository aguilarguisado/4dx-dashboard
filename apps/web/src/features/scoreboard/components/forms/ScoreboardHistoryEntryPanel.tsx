import { useScoreboardFormContext } from '../../contexts/ScoreboardFormContext';

import { ErrorMessage } from '@/components/ErrorMessage';
import { InputCalendarControl } from '@/components/forms/controls/InputCalendarControl';
import { InputNumberControl } from '@/components/forms/controls/InputNumberControl';
import { InputTextControl } from '@/components/forms/controls/InputTextControl';
import { FormFooter } from '@/components/forms/FormFooter';
import { setScoreboard } from '@/features/wig';
import { parseApiError, trpc } from '@/lib/trpc';
import { useAppDispatch } from '@/store/store';

import { zodResolver } from '@hookform/resolvers/zod';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ReactNode, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
	CreateScoreboardHistoryDTO,
	CreateScoreboardHistoryDTOSchema,
} from 'server/src/scoreboard/data/dtos/CreateScoreboardHistoryDTO';

type ScoreboardHistoryEntryPanelProps = {
	launcher?: ReactNode;
	onClose?: () => void;
};

export const ScoreboardHistoryEntryPanel = (props: ScoreboardHistoryEntryPanelProps) => {
	const { launcher, onClose } = props;
	const { wigId, containerType, containerId, scoreboardId } = useScoreboardFormContext();
	if (!scoreboardId) {
		throw new Error('Scoreboard is required in edit mode');
	}
	const dispatch = useAppDispatch();

	const op = useRef<OverlayPanel>(null);
	const defaultValues: CreateScoreboardHistoryDTO = {
		wigId,
		containerId,
		scoreboardId,
		containerType,
		date: new Date(new Date().setHours(0, 0, 0, 0)),
		value: 0,
	};
	const [error, setError] = useState<string | null>(null);
	const formMethods = useForm<CreateScoreboardHistoryDTO>({
		resolver: zodResolver(CreateScoreboardHistoryDTOSchema),
		defaultValues,
	});

	const { trigger, getValues } = formMethods;

	const { mutateAsync: create, isLoading } = trpc.scoreboard.addScoreboardEntry.useMutation();

	const hideDialog = () => {
		op.current?.hide();
		onClose?.();
	};

	const submitForm = async () => {
		const isValid = await trigger();
		if (isValid) {
			onSubmit(getValues());
		}
	};

	const onSubmit = async (data: CreateScoreboardHistoryDTO) => {
		setError(null);
		try {
			const newData = await create(data);
			dispatch(setScoreboard({ containerType, containerId, scoreboard: newData }));
			hideDialog();
		} catch (error: unknown) {
			setError((error as Error).message);
		}
	};

	return (
		<>
			{launcher && (
				<div>
					<span
						onClick={(e) => {
							op.current?.toggle(e);
						}}
					>
						{launcher}
					</span>
				</div>
			)}
			<OverlayPanel
				ref={op}
				showCloseIcon
				id="overlay_panel"
				style={{ width: '450px' }}
				className="overlaypanel-demo"
			>
				<>
					{error && <ErrorMessage message={parseApiError(error)} />}
					<FormProvider {...formMethods}>
						<ScoreboardHistoryEntryPanelLayout />
						<FormFooter isLoading={isLoading} mode={'create'} onCancel={hideDialog} onSubmit={submitForm} />
					</FormProvider>
				</>
			</OverlayPanel>
		</>
	);
};

export const ScoreboardHistoryEntryPanelLayout = () => {
	return (
		<div>
			<InputCalendarControl name="date" label={{ id: 'scoreboard.history.form.label.date' }} />
			<InputNumberControl name="value" label={{ id: 'scoreboard.history.form.label.value' }} />
			<InputTextControl name="comment" label={{ id: 'scoreboard.history.form.label.comment' }} />
		</div>
	);
};
