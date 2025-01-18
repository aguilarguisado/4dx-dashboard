// ProgressScoreboardForm.tsx
import { useScoreboardFormContext } from '../../contexts/ScoreboardFormContext';
import { ProgressScoreboard } from '../display/ProgressScoreboard';

import { InputNumberControl } from '@/components/forms/controls/InputNumberControl';
import { InputTextControl } from '@/components/forms/controls/InputTextControl';
import { useFormNamespace } from '@/hooks/UseFormNamespace';

import { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import {
	ProgressScoreboardConfig,
	ScoreboardConfigType,
	ScoreboardVisualizationType,
} from 'server/src/wig/domain/types/Scoreboard';

type ProgressScoreboardFormProps = {
	showPreview?: boolean;
};

export const ProgressScoreboardFormLayout = (props: ProgressScoreboardFormProps) => {
	const { showPreview = true } = props;
	const { namespace } = useScoreboardFormContext();
	const formContext = useFormContext();
	const { watch } = formContext;
	const formNamespace = useFormNamespace(namespace);

	useEffect(() => {
		const hasChangedType = formNamespace.getValue<ScoreboardVisualizationType>('visualizationType') !== 'progress';
		if (hasChangedType) {
			formNamespace.setValueWithNamespace<ScoreboardVisualizationType>('visualizationType', 'progress');
			formNamespace.setValueWithNamespace<ScoreboardConfigType>('config', { init: 0, target: 100, current: 0 });
		}
		if (formNamespace.getValue('config') === undefined) {
			formNamespace.setValueWithNamespace<ScoreboardConfigType>('config', { init: 0, target: 100, current: 0 });
			return;
		}
	}, []);

	const getInitErrorMessage = (error: FieldError) => {
		type InitError = { message?: string; target?: { message?: string } };
		const initError: InitError | undefined = error as InitError;
		let message = initError?.message;
		if (!message) {
			message = initError?.target?.message;
		}
		return message as string;
	};

	if (showPreview) {
		watch();
	}

	const configValues = formNamespace.getValue('config') as ProgressScoreboardConfig | undefined;
	if (configValues) {
		if (configValues.init === undefined) {
			configValues.init = 0;
		}
		if (configValues.target === undefined) {
			configValues.target = 100;
		}
		if (configValues.current === undefined) {
			configValues.current = 0;
		}
	}
	return (
		<>
			{configValues && showPreview && (
				<>
					<div className="text-400 col-12 px-0 mt-2">
						<FormattedMessage id="app.preview" />
					</div>
					<ProgressScoreboard className="w-full" config={configValues} />
				</>
			)}
			<div>
				<InputNumberControl
					name={formNamespace.getNameKey('config.init')}
					label={{ id: 'scoreboard.progress.form.label.init' }}
					onError={getInitErrorMessage}
				/>
				<InputNumberControl
					name={formNamespace.getNameKey('config.target')}
					label={{ id: 'scoreboard.progress.form.label.target' }}
				/>
				<InputNumberControl
					name={formNamespace.getNameKey('config.current')}
					label={{ id: 'scoreboard.progress.form.label.current' }}
				/>
				<InputTextControl
					name={formNamespace.getNameKey('config.unit')}
					label={{ id: 'scoreboard.progress.form.label.unit' }}
				/>
				<InputTextControl
					name={formNamespace.getNameKey('config.caption')}
					label={{ id: 'scoreboard.progress.form.label.caption' }}
				/>
			</div>
		</>
	);
};
