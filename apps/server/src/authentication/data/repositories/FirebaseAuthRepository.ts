import { buildUnknownError } from '../../../common/data/exceptions/utils';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { AuthRepository } from '../../domain/AuthRepository';
import { AuthenticatedUser, CreateUser } from '../../domain/models/AuthenticatedUser';

import admin from 'firebase-admin';
import { injectable } from 'inversify';
import { Either, Right } from 'purify-ts';

@injectable()
export class FirebaseAuthRepository implements AuthRepository {
	public async createUser(createUser: CreateUser): Promise<Either<UnknownError, AuthenticatedUser>> {
		try {
			const { displayName, password, email, role, organizationId } = createUser;

			const { uid } = await admin.auth().createUser({ displayName, password, email });
			await admin.auth().setCustomUserClaims(uid, { role, organizationId });
			return Right({
				id: uid,
				email,
				displayName,
				role,
				organizationId,
			});
		} catch (error) {
			return buildUnknownError(error);
		}
	}
	public async decodeAndVerifyToken(token: string): Promise<Either<UnknownError, AuthenticatedUser>> {
		try {
			const decodedToken = await admin.auth().verifyIdToken(token);
			const { uid, email = 'noemail@email.com', displayName, role, organizationId } = decodedToken;
			return Right({
				id: uid,
				email,
				displayName,
				role,
				organizationId,
			});
		} catch (error) {
			return buildUnknownError(error);
		}
	}
}
