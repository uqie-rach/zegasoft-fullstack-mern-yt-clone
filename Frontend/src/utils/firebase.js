import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-Z0Y8h7N4jRJwLYIqmxIwjRKCRf5Q2ig",
  authDomain: "yt-clone-5fd66.firebaseapp.com",
  projectId: "yt-clone-5fd66",
  storageBucket: "yt-clone-5fd66.appspot.com",
  messagingSenderId: "572183500648",
  appId: "1:572183500648:web:eaae2193756af9a3fa68dd",
  measurementId: "G-6Y6FMRXWLK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
