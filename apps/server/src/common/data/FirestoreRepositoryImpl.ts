import { buildUnknownError } from './exceptions/utils';
import { getDBInstance } from '../../lib/firestore/FirestoreDB';
import { BaseRepository } from '../domain/BaseRepository';
import { EntityNotExistsError } from '../domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../domain/exceptions/UnknownError';
import { BaseModel } from '../domain/models/BaseModel';
import { removeKeys } from '../domain/ModelUtils';

import { DocumentData, FieldValue, Firestore, Timestamp } from '@google-cloud/firestore';
import { injectable } from 'inversify';
import { EitherAsync } from 'purify-ts';
import { Either, Left, Right } from 'purify-ts/Either';
import { v4 as uuid } from 'uuid';

@injectable()
export abstract class FirestoreRepositoryImpl<T extends DocumentData & BaseModel> implements BaseRepository<T> {
	private db: Firestore;

	constructor() {
		this.db = getDBInstance();
	}

	abstract getCollectionPath(): string;

	protected getCollection() {
		return this.db.collection(this.getCollectionPath());
	}

	protected mapQuerySnapshotToEntities(querySnapshot: FirebaseFirestore.QuerySnapshot): T[] {
		return querySnapshot.docs.map((doc) => this.mapDocumentDataToEntity(doc.data()));
	}

	protected mapDocumentDataToEntity(document: DocumentData): T {
		// Dates conversion from Firebase Timestamp to JS Date
		return this.convertFirebaseDatesToDate(document) as T;
	}

	async setFieldsToUndefined(id: string, fields: string[]) {
		const docRef = this.getCollection().doc(id);
		const updateObject: { [fieldName: string]: FieldValue } = {};
		fields.forEach((field) => {
			updateObject[field] = FieldValue.delete();
		});
		return docRef.update(updateObject);
	}

	async find(id: string): Promise<Either<UnknownError | EntityNotExistsError, T>> {
		try {
			const doc = await this.getCollection().doc(id).get();
			const docData = doc.data();
			if (!doc.exists || !docData) {
				return Left(new EntityNotExistsError(`Document with id ${id} not found`));
			}
			return Right(this.mapDocumentDataToEntity(docData) as T);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	async create(data: T | Omit<T, 'id'>): Promise<Either<UnknownError, T>> {
		try {
			const id = data.id || uuid();
			const newDoc: T = { ...data, id, createdAt: new Date(), updatedAt: new Date() } as T;
			await this.getCollection().doc(id).set(newDoc);
			return Right(newDoc);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	async update(id: string, data: Partial<T>): Promise<Either<UnknownError | EntityNotExistsError, T>> {
		return EitherAsync.fromPromise(() => this.write(id, data))
			.chain(() => this.find(id))
			.map((entity) => entity as T);
	}

	async write(id: string, data: Partial<T>): Promise<Either<UnknownError | EntityNotExistsError, undefined>> {
		try {
			const updateDoc = { ...removeKeys(data, ['createdAt', 'id', 'organizationId']), updatedAt: new Date() };
			await this.getCollection().doc(id).update(updateDoc);
			return Right(undefined);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	async delete(id: string): Promise<Either<UnknownError, undefined>> {
		try {
			await this.getCollection().doc(id).delete();
			return Right(undefined);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	private convertFirebaseDatesToDate(firebaseObject: DocumentData): DocumentData {
		for (const key in firebaseObject) {
			if (Object.prototype.hasOwnProperty.call(firebaseObject, key)) {
				const value = firebaseObject[key];
				if (value instanceof Timestamp) {
					firebaseObject[key] = value.toDate();
				} else if (typeof value === 'object' && value !== null) {
					firebaseObject[key] = this.convertFirebaseDatesToDate(value); // Recursive call for nested objects
				}
			}
		}
		return firebaseObject;
	}
}
