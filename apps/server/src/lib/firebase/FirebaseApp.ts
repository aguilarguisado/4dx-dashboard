import serviceAccount from '../../../firebase.json';

import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { App } from 'firebase-admin/app';

dotenv.config();
const emulatorHost = process.env.FIRESTORE_URL;
const firebaseAuthHost = process.env.FIREBASE_AUTH_URL;

let appInstance: App;
// To run local firebase emulator
// https://github.com/firebase/firebase-admin-node/issues/776#issuecomment-751685424
if (process.env.NODE_ENV === 'test') {
	if (!emulatorHost) {
		throw new Error('FIRESTORE_URL must be set in .env');
	}
	if (!firebaseAuthHost) {
		throw new Error('FIREBASE_AUTH_URL must be set in .env');
	}
	process.env['FIRESTORE_EMULATOR_HOST'] = emulatorHost;
	process.env['FIREBASE_AUTH_EMULATOR_HOST'] = firebaseAuthHost;
}

export const initializeFirebase = () => {
	if (!appInstance) {
		appInstance = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
		});
	}
	return appInstance;
};

export async function clearAuth() {
	const projectId = serviceAccount.project_id;
	const res = await fetch(`http://${firebaseAuthHost}/emulator/v1/projects/${projectId}/accounts`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Bearer owner',
		},
	});

	if (res.status !== 200) throw new Error('Unable to reset Authentication Emulators');
}
