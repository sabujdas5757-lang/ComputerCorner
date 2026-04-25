import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCa_5xCz4aoP4nINjsBa-H6ncES34ldH8",
  authDomain: "computer-corner-f712c.firebaseapp.com",
  projectId: "computer-corner-f712c",
  storageBucket: "computer-corner-f712c.firebasestorage.app",
  messagingSenderId: "606519984780",
  appId: "1:606519984780:web:6d4fc837334dcd012271a9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
