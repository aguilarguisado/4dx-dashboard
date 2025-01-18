import firebaseConfig from '../firebase.json';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
