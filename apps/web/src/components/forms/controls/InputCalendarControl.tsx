import { ControlValueAccessorProps } from '@/components/forms/controls/ControlValueAccessorProp';
import { buildError, createControl } from '@/components/forms/controls/Utils';
import { FormError } from '@/components/forms/FormError';

import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { ForwardedRef, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';

export const InputCalendarElement = forwardRef<
	ForwardedRef<unknown>,
	ControlValueAccessorProps<Date | null | undefined>
>(
	(
		{ value, name, label, onChange, onError, error, isSubmitting },
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ref,
	) => {
		const onValueChange = (value?: Date | null) => {
			onChange(value);
		};

		return (
			<div className="field p-fluid">
				{label && (
					<label htmlFor={name} className={classNames({ 'p-error': error })}>
						<FormattedMessage {...label} />
					</label>
				)}

				<Calendar
					value={value}
					onChange={(e) => onValueChange(e.target.value)}
					showIcon
					disabled={isSubmitting}
				/>
				{error && <FormError message={buildError(error, onError)} />}
			</div>
		);
	},
);

export const InputCalendarControl = createControl<
	Date | null | undefined,
	ControlValueAccessorProps<Date | null | undefined>
>(InputCalendarElement);
