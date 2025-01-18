import { ControlValueAccessorProps } from './ControlValueAccessorProp';

import { IntlObject } from 'i18n';
import { ComponentType } from 'react';
import { Controller, FieldError } from 'react-hook-form';

type ComponentControlProps<T, V> = {
	name: string;
	label?: IntlObject;
	onError?: (error: FieldError) => string;
} & Omit<T, keyof ControlValueAccessorProps<V>>;

export function createControl<V, T extends ControlValueAccessorProps<V>>(ValueAccessor: ComponentType<T>) {
	const displayName = ValueAccessor.displayName || ValueAccessor.name || 'Component';
	const ComponentControl = (props: ComponentControlProps<T, V>) => {
		const { name } = props;
		return (
			<Controller
				name={name}
				render={({ field, fieldState }) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return <ValueAccessor {...props} {...fieldState} {...(field as any)} />;
				}}
			/>
		);
	};

	ComponentControl.displayName = `${displayName}Control`;

	return ComponentControl;
}

export const buildError = (error: FieldError | undefined, onError?: (error: FieldError) => string) => {
	if (error && onError) {
		return onError(error);
	}
	return error?.message;
};
