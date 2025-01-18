import { ControlValueAccessorProps } from '@/components/forms/controls/ControlValueAccessorProp';
import { buildError, createControl } from '@/components/forms/controls/Utils';
import { FormError } from '@/components/forms/FormError';

import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { ForwardedRef, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';

export const InputCheckboxElement = forwardRef<ForwardedRef<unknown>, ControlValueAccessorProps<boolean>>(
	(
		{ value, name, label, onChange, onError, error, isSubmitting },
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ref,
	) => {
		const onValueChange = (value: boolean) => {
			onChange(value);
		};

		return (
			<div className="field-checkbox p-fluid">
				<Checkbox
					inputId={name}
					onChange={(e) => onValueChange(e.checked || false)}
					checked={value}
					disabled={isSubmitting}
				/>
				{error && <FormError message={buildError(error, onError)} />}
				{label && (
					<label htmlFor={name} className={classNames({ 'p-error': error })}>
						<FormattedMessage {...label} />
					</label>
				)}
			</div>
		);
	},
);

export const InputCheckboxControl = createControl<boolean, ControlValueAccessorProps<boolean>>(InputCheckboxElement);
