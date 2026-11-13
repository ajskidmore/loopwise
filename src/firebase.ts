/**
 * Firebase setup. Config comes from .env.local (see .env.example).
 * If config is missing the app still works in guest mode (progress saved in this browser only).
 *
 * The Firebase SDK is large, so it is loaded lazily the first time it's needed —
 * the learning path appears without waiting for it.
 */
const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId);

async function load() {
  const [{ initializeApp }, authMod, fsMod] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);
  const app = initializeApp(config);
  return { auth: authMod.getAuth(app), db: fsMod.getFirestore(app), authMod, fsMod };
}

export type FirebaseKit = Awaited<ReturnType<typeof load>>;
let kit: Promise<FirebaseKit> | null = null;

/** Loads Firebase once. Throws if accounts aren't configured. */
export function getFirebase(): Promise<FirebaseKit> {
  if (!firebaseEnabled) return Promise.reject(new Error('Accounts are not configured yet.'));
  kit ??= load();
  return kit;
}
