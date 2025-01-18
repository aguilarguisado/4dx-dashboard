import { LoggedUser } from '../types';

export const storeUser = (user: LoggedUser) => {
	localStorage.setItem('user', JSON.stringify(user));
};

export const getStoredUser = (): LoggedUser | null => {
	const user = localStorage.getItem('user');
	if (user) {
		return JSON.parse(user);
	}
	return null;
};

export const removeStoredUser = () => {
	localStorage.removeItem('user');
};
