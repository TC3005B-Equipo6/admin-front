import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AppConfigError } from "./errors/AppConfigError";

const requiredEnv = (
  value: string | undefined
) => {
  if (!value) {
    throw new AppConfigError();
  }

  return value;
};

const getFirebaseConfig = () => ({
  apiKey: requiredEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: requiredEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: requiredEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: requiredEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: requiredEnv(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: requiredEnv(import.meta.env.VITE_FIREBASE_APP_ID),
});

export const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(getFirebaseConfig());
};

export const getAuthInstance = () => {
  return getAuth(getFirebaseApp());
};
