import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { AuthUser } from '~/types/firebase';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;

  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    databaseURL: config.firebaseDatabaseURL,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId,
  };
  
  const app = initializeApp(firebaseConfig);
  
  return {
    provide: {
      firebase: {
        app,
        auth: getAuth(app),
        db: getFirestore(app)
      }
    }
  };
});

export const useFirebase = () => {
  const authUser = ref<AuthUser | null>(null);
  const { $firebase: { auth } } = useNuxtApp();

  onMounted(() => {
    auth.onAuthStateChanged((user) => {
      authUser.value = user;
    });
  });

  return {
    user: readonly(authUser)
  };
};