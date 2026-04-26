// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVfPyhM9eMQjXSMU_4lVJyO2Iv0z0TfkU",
  authDomain: "swifttask-42c0e.firebaseapp.com",
  projectId: "swifttask-42c0e",
  storageBucket: "swifttask-42c0e.firebasestorage.app",
  messagingSenderId: "360973139928",
  appId: "1:360973139928:web:fd82e6ead5375787e83cad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)