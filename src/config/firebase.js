import { RecaptchaVerifier, getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD5qoQVoVF0BXE1R8fyNHotYYw-Emy5NM",
  authDomain: "datn-hospital-fe-32c4f.firebaseapp.com",
  projectId: "datn-hospital-fe-32c4f",
  storageBucket: "datn-hospital-fe-32c4f.appspot.com",
  messagingSenderId: "450619398850",
  appId: "1:450619398850:web:d4fa638e8cd1a3a9cf795b",
  measurementId: "G-W94HTLPZMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
auth.languageCode = "vn";

export { auth };
