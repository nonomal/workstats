import { getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

interface UserType extends Record<string, any> {
  asana?: {
    userId: string;
    workspace: [
      {
        personalAccessToken: string;
        workspaceId: string;
        workspaceName: string;
      },
    ];
  };
  assessor?: string;
  assignedPj?: string;
  avatarUrl?: string;
  birth?: Timestamp;
  department?: string;
  firstName?: string;
  github?: {
    repositories: [
      {
        owner: string;
        repo: string;
      },
    ];
    userId: number;
    userName: string;
  };
  documentId?: string;
  lastName?: string;
  rank?: string;
  role?: string;
  slack?: {
    workspace: [
      {
        memberId: string;
        workspaceName: string;
      },
    ];
  };
  supervisor?: string;
};

export { app, db, auth, googleProvider };
export type { UserType };