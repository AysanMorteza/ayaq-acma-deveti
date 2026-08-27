import { initializeApp, getApps } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore,
  setLogLevel
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Set log level to silent so transient network negotiation notes do not throw console errors
try {
  setLogLevel("silent");
} catch {
  // Ignore if already configured
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


