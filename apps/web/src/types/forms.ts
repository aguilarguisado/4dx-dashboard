export type FormMode = 'create' | 'edit';

export type BaseFormProps<T> = {
	onSubmit: (data: T) => void;
};

export type BaseFormHandle = {
	submit: () => void;
};
