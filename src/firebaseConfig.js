import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvC4rXCiFv06FRqujpnhCKoc_Jg6RqLfs",
  authDomain: "my-craftique.firebaseapp.com",
  projectId: "my-craftique",
  storageBucket: "my-craftique.firebasestorage.app",
  messagingSenderId: "622721304691",
  appId: "1:622721304691:web:b3cf37bd46edb045b24206",
  measurementId: "G-4MT96GMWJ9"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, provider, signInWithPopup, signOut, db, storage };
export default app;