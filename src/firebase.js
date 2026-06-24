// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIpc-gOdrhHPVivjuA9kjUe36o452jNsk",
  authDomain: "react-auth-appcom.firebaseapp.com",
  projectId: "react-auth-appcom",
  storageBucket: "react-auth-appcom.firebasestorage.app",
  messagingSenderId: "963892982982",
  appId: "1:963892982982:web:4c1533e36bde9ec43093c7",
  measurementId: "G-VMCHZ56S3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
