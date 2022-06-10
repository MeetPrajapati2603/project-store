import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQsR-2e1jCSpbyvpbc_XB5W3BzAczZdQI",
  authDomain: "project-store-922a5.firebaseapp.com",
  projectId: "project-store-922a5",
  storageBucket: "project-store-922a5.appspot.com",
  messagingSenderId: "1094463327420",
  appId: "1:1094463327420:web:4ad083e90c9027fe2654b9",
  measurementId: "G-31JNMVCZNH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const updateUserDatabase = async (user, uid) => {
  if (typeof user !== "object") return;

  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { ...user, uid });
};

const getUserFromDatabase = async (uid) => {
  const docRef = doc(db, "users", uid);
  const result = await getDoc(docRef);

  if (!result.exists()) return null;
  return result.data();
};

export { app as default, auth, db, updateUserDatabase, getUserFromDatabase };
