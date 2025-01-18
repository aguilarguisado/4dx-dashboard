import { ControlValueAccessorProps } from '@/components/forms/controls/ControlValueAccessorProp';
import { buildError, createControl } from '@/components/forms/controls/Utils';
import { FormError } from '@/components/forms/FormError';

import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { ForwardedRef, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';

export const InputTextFormElement = forwardRef<ForwardedRef<unknown>, ControlValueAccessorProps<number | undefined>>(
	(
		{ value, name, label, onChange, onError, error, isSubmitting },
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ref,
	) => {
		const onValueChange = (value: number | null) => {
			onChange(value == null ? undefined : value);
		};

		return (
			<div className="field p-fluid">
				{label && (
					<label htmlFor={name} className={classNames({ 'p-error': error })}>
						<FormattedMessage {...label} />
					</label>
				)}
				<InputNumber
					name={name}
					onChange={(event) => onValueChange(event.value)}
					maxFractionDigits={2}
					disabled={isSubmitting}
					className={classNames({ 'p-invalid': !!error })}
					value={value}
				/>
				{error && <FormError message={buildError(error, onError)} />}
			</div>
		);
	},
);

export const InputNumberControl = createControl<number | undefined, ControlValueAccessorProps<number | undefined>>(
	InputTextFormElement,
);
