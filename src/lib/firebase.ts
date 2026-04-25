import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🗝️ BURAYI FİREBASE'DEN ALDIĞIN ANAHTARLARLA DOLDUR
const firebaseConfig = {
  apiKey: "AIzaSyB3WEOqxxMSvEoqHmqgjbY38nAroRP9ru0",
  authDomain: "prepmaster-c1807.firebaseapp.com",
  projectId: "prepmaster-c1807",
  storageBucket: "prepmaster-c1807.firebasestorage.app",
  messagingSenderId: "502195583676",
  appId: "1:502195583676:web:be93fecd8d878ad060eeb9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);