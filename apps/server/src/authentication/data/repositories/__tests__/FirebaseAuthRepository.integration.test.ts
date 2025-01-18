import { resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { clearAuth } from '../../../../lib/firebase/FirebaseApp';
import { CreateUser } from '../../../domain/models/AuthenticatedUser';
import { FirebaseAuthRepository } from '../FirebaseAuthRepository'; // Adjust the import path as necessary

import * as admin from 'firebase-admin';
import { Container } from 'inversify';
import { randomUUID } from 'node:crypto';

describe('FirebaseAuthRepository', () => {
	let repo: FirebaseAuthRepository;
	let container: Container;
	let userToCreate: Omit<CreateUser, 'email'>;

	beforeEach(async () => {
		container = resetTestAppContainer();
		repo = container.get(Symbol.for('AuthRepository'));
		userToCreate = {
			password: 'password',
			displayName: 'test',
			role: 'user',
			organizationId: 'org123',
		};
	});

	afterAll(async () => {
		await clearAuth();
	});

	describe('createUser', () => {
		it('should successfully create a user and set custom claims', async () => {
			const newUser = { ...userToCreate, email: `${randomUUID()}@example.com` };
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...userToCheck } = newUser;
			const result = await repo.createUser(newUser);
			expect(result.isRight()).toBeTruthy();
			expect(result.extract()).toMatchObject(userToCheck);
		});

		it('should handle errors and return an UnknownError', async () => {
			// To force error
			const result = await repo.createUser(undefined as unknown as CreateUser);
			expect(result.isLeft()).toBeTruthy();
		});
	});

	describe('decodeAndVerifyToken', () => {
		it('should successfully decode and verify a token', async () => {
			const getIdToken = async (uid: string): Promise<string> => {
				const apiKey = process.env.FIREBASE_API_KEY;
				const firebaseAuthHost = process.env.FIREBASE_AUTH_URL;
				if (!apiKey) throw new Error('API key not found in environment variables.');
				if (!firebaseAuthHost) throw new Error('Firebase Auth URL not found in environment variables.');

				const customToken = await admin.auth().createCustomToken(uid);
				try {
					const response = await fetch(
						`http://${firebaseAuthHost}/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${apiKey}`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								token: customToken,
								returnSecureToken: true,
							}),
						},
					);

					const data = await response.json();
					return data.idToken;
				} catch (error) {
					throw new Error('Unable to get id token');
				}
			};
			const newUser = { ...userToCreate, email: `${randomUUID()}@example.com` };
			const userCreated = await repo.createUser(newUser);
			expect(userCreated.isRight()).toBeTruthy();
			const user = userCreated.unsafeCoerce();
			const token = await getIdToken(user.id);
			const result = await repo.decodeAndVerifyToken(token);
			expect(result.isRight()).toBeTruthy();
			expect(result.extract()).toMatchObject({
				id: user.id,
				email: user.email,
				organizationId: user.organizationId,
				role: user.role,
			});
		});

		it('should handle errors and return an UnknownError', async () => {
			const result = await repo.decodeAndVerifyToken(undefined as unknown as string);
			expect(result.isLeft()).toBeTruthy();
		});
	});
});
