/**
 * Holds the learner's progress and account.
 * - Always saved to localStorage (works offline / as a guest).
 * - When signed in, merged with Firestore users/{uid} on login, then saved there (debounced).
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { firebaseEnabled, getFirebase } from '../firebase';
import { emptyProgress, mergeProgress, normalize, type Progress } from './model';

const LOCAL_KEY = 'loopwise.progress.v1';

/** Only the bits of a Firebase user the UI needs. */
export interface Account { uid: string; displayName: string | null; email: string | null }

interface Ctx {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  user: Account | null;
  authReady: boolean;
  syncing: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetProgress: () => void;
}

const ProgressCtx = createContext<Ctx | null>(null);

function loadLocal(): Progress {
  try {
    return normalize(JSON.parse(localStorage.getItem(LOCAL_KEY) ?? 'null'));
  } catch {
    return emptyProgress();
  }
}

const toAccount = (u: User): Account => ({ uid: u.uid, displayName: u.displayName, email: u.email });

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadLocal);
  const [user, setUser] = useState<Account | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseEnabled);
  const [syncing, setSyncing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef<Account | null>(null);
  const fromOtherTab = useRef(false);

  // Persist locally on every change (except changes that just came from another tab).
  useEffect(() => {
    if (fromOtherTab.current) {
      fromOtherTab.current = false;
      return;
    }
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
    } catch {
      /* storage full or blocked — progress still lives in memory */
    }
  }, [progress]);

  // Keep tabs in sync: progress made in another tab shows up here.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_KEY && e.newValue) {
        try {
          const incoming = normalize(JSON.parse(e.newValue));
          fromOtherTab.current = true;
          setProgress((p) => mergeProgress(p, incoming));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const saveRemote = useCallback((p: Progress) => {
    const u = userRef.current;
    if (!u || !firebaseEnabled) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const { db, fsMod } = await getFirebase();
        await fsMod.setDoc(fsMod.doc(db, 'users', u.uid), { progress: p, displayName: u.displayName ?? '', updatedAt: fsMod.serverTimestamp() });
      } catch (e) {
        console.warn('[loopwise] cloud save failed', e);
      }
    }, 1500);
  }, []);

  // Auth listener (loads Firebase lazily): on sign-in, merge local + cloud.
  useEffect(() => {
    if (!firebaseEnabled) return;
    let unsub: (() => void) | undefined;
    let cancelled = false;
    getFirebase().then(({ auth, db, authMod, fsMod }) => {
      if (cancelled) return;
      unsub = authMod.onAuthStateChanged(auth, async (u) => {
        const acct = u ? toAccount(u) : null;
        userRef.current = acct;
        setUser(acct);
        setAuthReady(true);
        if (!u) return;
        setSyncing(true);
        try {
          const snap = await fsMod.getDoc(fsMod.doc(db, 'users', u.uid));
          const remote = normalize(snap.exists() ? snap.data().progress : null);
          setProgress((local) => {
            const merged = mergeProgress(local, remote);
            saveRemote(merged);
            return merged;
          });
        } catch (e) {
          console.warn('[loopwise] cloud load failed', e);
        } finally {
          setSyncing(false);
        }
      });
    }).catch((e) => {
      console.warn('[loopwise] could not load accounts', e);
      setAuthReady(true);
    });
    return () => { cancelled = true; unsub?.(); };
  }, [saveRemote]);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((p) => {
      const next = fn(p);
      saveRemote(next);
      return next;
    });
  }, [saveRemote]);

  const value: Ctx = {
    progress, update, user, authReady, syncing,
    signInGoogle: async () => {
      const { auth, authMod } = await getFirebase();
      await authMod.signInWithPopup(auth, new authMod.GoogleAuthProvider());
    },
    signInEmail: async (email, password) => {
      const { auth, authMod } = await getFirebase();
      await authMod.signInWithEmailAndPassword(auth, email, password);
    },
    signUpEmail: async (name, email, password) => {
      const { auth, authMod } = await getFirebase();
      const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await authMod.updateProfile(cred.user, { displayName: name });
        const acct = toAccount(cred.user);
        userRef.current = acct;
        setUser(acct);
      }
    },
    resetPassword: async (email) => {
      const { auth, authMod } = await getFirebase();
      await authMod.sendPasswordResetEmail(auth, email);
    },
    signOut: async () => {
      // Flush any pending cloud save before signing out.
      if (saveTimer.current) clearTimeout(saveTimer.current);
      const u = userRef.current;
      if (u) {
        try {
          const { db, fsMod } = await getFirebase();
          await fsMod.setDoc(fsMod.doc(db, 'users', u.uid), { progress, displayName: u.displayName ?? '', updatedAt: fsMod.serverTimestamp() });
        } catch { /* best effort */ }
      }
      const { auth, authMod } = await getFirebase();
      userRef.current = null;
      await authMod.signOut(auth);
      // Start the device fresh so the next person doesn't see this account's progress.
      setProgress(emptyProgress());
    },
    resetProgress: () => update(() => ({ ...emptyProgress(), dailyGoal: progress.dailyGoal, updatedAt: Date.now() })),
  };

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): Ctx {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error('useProgress must be used inside ProgressProvider');
  return c;
}
