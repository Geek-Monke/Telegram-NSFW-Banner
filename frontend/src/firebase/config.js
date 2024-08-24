
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIbiuEgEot0KX6d20Pd7wDD2zMkrg1bBc",
  authDomain: "adultblocker-bd0e3.firebaseapp.com",
  projectId: "adultblocker-bd0e3",
  storageBucket: "adultblocker-bd0e3.appspot.com",
  messagingSenderId: "347202610726",
  appId: "1:347202610726:web:ba1c8dde0482918469e8e7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);