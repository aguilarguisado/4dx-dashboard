import { AuthApi } from './AuthApi';
import { auth } from '../../lib/Firebase';
import { LoggedUser, LoginUser } from '../types';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export class FirebaseAuthApi implements AuthApi<LoggedUser> {
	private static instance: FirebaseAuthApi;
	private constructor() {}

	static getInstance(): FirebaseAuthApi {
		if (!FirebaseAuthApi.instance) {
			FirebaseAuthApi.instance = new FirebaseAuthApi();
		}
		return FirebaseAuthApi.instance;
	}

	initApi(onInit?: () => void): void {
		auth.onAuthStateChanged(() => {
			onInit?.();
		});
	}

	async login(user: LoginUser): Promise<LoggedUser> {
		await signInWithEmailAndPassword(auth, user.email, user.password);
		const loggedUser = await this.getLoggedUser();
		if (!loggedUser) {
			throw new Error('User not found');
		}
		return loggedUser;
	}
	async logout(): Promise<void> {
		await signOut(auth);
	}

	async getLoggedUser(): Promise<LoggedUser | undefined> {
		const user = auth.currentUser;
		if (user) {
			return {
				id: user.uid,
				email: user.email as string,
				name: user.displayName,
				token: await user.getIdToken(),
			};
		}
	}
}
