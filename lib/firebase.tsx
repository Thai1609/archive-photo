import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Cấu hình Firebase (Lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Hàm đăng ký tài khoản và lưu vào Firestore
const registerUser = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Lưu thông tin user vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName,
      email,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Hàm đăng nhập
const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Hàm đăng xuất
const logout = () => signOut(auth);

export { auth, db, registerUser, loginUser, logout };
