import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigData from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfigData) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
