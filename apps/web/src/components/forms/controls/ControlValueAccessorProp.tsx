import { IntlObject } from 'i18n';
import { FieldError } from 'react-hook-form/dist/types/errors';

export type ControlValueAccessorProps<T> = {
	value: T;
	name: string;
	label?: IntlObject;
	onError?: (error: FieldError) => string;
	onChange: (value: T) => void;
	error?: FieldError;
	isSubmitting?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ref?: any;
};
