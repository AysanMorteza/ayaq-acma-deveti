import { initializeApp, getApps } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore,
  setLogLevel
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Configure Firestore logging level to prevent noisy transient warnings
try {
  setLogLevel("error");
} catch {
  // Ignore if already set
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId || "(default)");
} catch {
  try {
    firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
  } catch (err) {
    console.warn("Firestore fallback initialization:", err);
    firestoreDb = getFirestore(app);
  }
}

export const db = firestoreDb;
export default app;


