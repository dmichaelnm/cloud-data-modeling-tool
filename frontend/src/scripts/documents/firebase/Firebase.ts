import { firebaseConfig } from 'src/scripts/config/FirebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initializes the firebase application
const firebaseApp = initializeApp(firebaseConfig);

// Firebase Authentication Service
export const fbAuth = getAuth(firebaseApp);
// Firestore Service
export const fbFirestore = getFirestore(firebaseApp);
