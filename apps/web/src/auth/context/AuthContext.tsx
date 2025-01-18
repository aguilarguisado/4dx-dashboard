import { AuthApi } from '../api/AuthApi';
import { FirebaseAuthApi } from '../api/FirebaseAuthApi';
import { LoggedUser } from '../types';
import { getStoredUser, removeStoredUser, storeUser } from '../utils/LocalStorageUser';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type AuthContextType = {
	isInitialized: boolean;
	user: LoggedUser | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<LoggedUser>;
	logout: () => Promise<void>;
	// signup: (email: string, password: string) => Promise<UserCredential>;
	// loginWithGoogle: () => Promise<UserCredential>;
	// resetPassword: (email: string) => Promise<void>;
};

const authContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(authContext);
	if (!context) throw new Error('There is no Auth provider');
	return context;
};

type AuthProviderProps = {
	children: ReactNode;
};

const authApi: AuthApi<LoggedUser> = FirebaseAuthApi.getInstance();

export function AuthProvider({ children }: AuthProviderProps) {
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const [user, setUser] = useState<LoggedUser | null>(getStoredUser());
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		authApi.initApi(() => setIsInitialized(true));
	}, []);

	const login = async (email: string, password: string): Promise<LoggedUser> => {
		setLoading(true);
		try {
			const loggedUser = await authApi.login({ email, password });
			setUser(loggedUser);
			storeUser(loggedUser);
			setLoading(false);
			return loggedUser;
		} catch (error) {
			setLoading(false);
			throw error;
		}
	};

	const logout = async () => {
		setLoading(true);
		setUser(null);
		removeStoredUser();
		setLoading(false);
	};

	// TODO: Future implementations

	/* const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const resetPassword = async (email: string) => sendPasswordResetEmail(auth, email);
  */

	return (
		<authContext.Provider
			value={{
				isInitialized,
				user,
				loading,
				login,
				logout,
				// signup,
				// loginWithGoogle,
				// resetPassword,
			}}
		>
			{children}
		</authContext.Provider>
	);
}

export const getAuthToken = async () => {
	const user = await authApi.getLoggedUser();
	return user ? `Token ${user.token}` : undefined;
};
