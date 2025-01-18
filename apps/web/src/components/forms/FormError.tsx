import { useZodTranslation } from '@/hooks/UseZodTranslation';

import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export type FormErrorProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	message?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
};

export const FormError = (props: FormErrorProps) => {
	const { message } = props;
	const translatedError = useZodTranslation(message as string);
	return message && <small className="p-error">{translatedError}</small>;
};
