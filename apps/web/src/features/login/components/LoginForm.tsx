import { LoginUser, LoginUserSchema } from '@/auth/types';
import { FormError } from '@/components/forms/FormError';
import { useTranslation } from '@/hooks/UseTranslation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';

export type LoginFormProps = {
	onSubmit: (user: LoginUser) => void;
};

export const LoginForm = (props: LoginFormProps) => {
	const { onSubmit } = props;
	const {
		control,
		handleSubmit,
		formState: { errors, isLoading },
	} = useForm({
		resolver: zodResolver(LoginUserSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const emailPlaceholder = useTranslation({ id: 'app.field.email' });
	const passwordPlaceholder = useTranslation({ id: 'app.field.password' });

	return (
		<form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
			<div className="field">
				<Controller
					name="email"
					control={control}
					render={({ field }) => <InputText {...field} placeholder={emailPlaceholder} />}
				/>
				<FormError message={errors.email?.message} />
			</div>
			<div className="field">
				<Controller
					name="password"
					control={control}
					render={({ field }) => <InputText {...field} type="password" placeholder={passwordPlaceholder} />}
				/>
				<FormError message={errors.password?.message} />
			</div>
			<div>
				<Button type="submit" label="Login" loading={isLoading} />
			</div>
		</form>
	);
};
