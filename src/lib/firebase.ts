import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQl9utiXLGooUjwV-soXZyXrrJTl6So2E",
  authDomain: "humsj-d1a2a.firebaseapp.com",
  projectId: "humsj-d1a2a",
  storageBucket: "humsj-d1a2a.firebasestorage.app",
  messagingSenderId: "639241219396",
  appId: "1:639241219396:web:5aa103cd8ee8e9ec7dbb11",
  measurementId: "G-FXJG71JTNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
