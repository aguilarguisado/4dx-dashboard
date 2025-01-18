import { ControlValueAccessorProps } from '@/components/forms/controls/ControlValueAccessorProp';
import { buildError, createControl } from '@/components/forms/controls/Utils';
import { FormError } from '@/components/forms/FormError';

import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ForwardedRef, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';

export const InputTextFormElement = forwardRef<ForwardedRef<unknown>, ControlValueAccessorProps<string>>(
	(
		{ value, name, label, onChange, onError, error, isSubmitting },
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ref,
	) => {
		const onValueChange = (value: string) => {
			onChange(value);
		};

		return (
			<div className="field p-fluid">
				{label && (
					<label htmlFor={name} className={classNames({ 'p-error': error })}>
						<FormattedMessage {...label} />
					</label>
				)}
				<InputText
					name={name}
					onChange={(e) => onValueChange(e.target.value)}
					disabled={isSubmitting}
					className={classNames({ 'p-invalid': !!error })}
					value={value}
				/>
				{error && <FormError message={buildError(error, onError)} />}
			</div>
		);
	},
);

export const InputTextControl = createControl<string, ControlValueAccessorProps<string>>(InputTextFormElement);
