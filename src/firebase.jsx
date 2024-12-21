// firebase.js or firebase.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIgWKE904al1DGYARgfxFjrmzwBjRlT3I",
  authDomain: "hostel-34e6a.firebaseapp.com",
  projectId: "hostel-34e6a",
  storageBucket: "hostel-34e6a.firebasestorage.app",
  messagingSenderId: "307307582358",
  appId: "1:307307582358:web:8a71a413663933bd38c3b7",
  measurementId: "G-8N9VEWS14W",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
