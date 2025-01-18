import { LoginForm } from './LoginForm';

import { useAuth } from '@/auth';
import { LoginUser } from '@/auth/types';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useTranslation } from '@/hooks/UseTranslation';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginContainer = () => {
	const { login } = useAuth();
	const [showError, setShowError] = useState(false);
	const errorMessage = useTranslation({ id: 'login.error' });

	const navigate = useNavigate();

	const onSubmit = async (data: LoginUser) => {
		setShowError(false);
		try {
			await login(data.email, data.password);
			navigate('/app/home');
		} catch (error) {
			setShowError(true);
		}
	};

	return (
		<>
			{showError && <ErrorMessage message={errorMessage} />}
			<LoginForm onSubmit={onSubmit} />
		</>
	);
};
