import { LoginUser } from '../types/LoginUser';

export type AuthApi<T> = {
	initApi: (onInit?: () => void) => void;
	getLoggedUser(): Promise<T | undefined>;
	login: (user: LoginUser) => Promise<T>;
	logout: () => Promise<void>;
};
