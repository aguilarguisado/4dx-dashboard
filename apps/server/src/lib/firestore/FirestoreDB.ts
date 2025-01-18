import { initializeFirebase } from '../firebase/FirebaseApp';

import admin from 'firebase-admin';

// Initialize the Firebase app
initializeFirebase();

// Declare a variable to hold the db instance
let dbInstance: FirebaseFirestore.Firestore | null = null;

export const getDBInstance = (): FirebaseFirestore.Firestore => {
	if (dbInstance === null) {
		// This code will only be executed once
		const db = admin.firestore();
		db.settings({ ignoreUndefinedProperties: true });
		dbInstance = db; // Save the created db instance for future calls
	}
	return dbInstance;
};

export const resetDB = async () => {
	if (process.env.NODE_ENV === 'test') {
		const db = getDBInstance();
		// Reset all firestore DB
		const collections = await db.listCollections();
		for (const collection of collections) {
			if (collection.id.startsWith('test_')) {
				const docs = await collection.get();
				for (const doc of docs.docs) {
					await doc.ref.delete();
				}
			}
		}
	}
};
