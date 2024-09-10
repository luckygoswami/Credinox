// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUZdiUck2TeV2BWSZsrIuGDQt06pwl7z4",
  authDomain: "passman-for-personal.firebaseapp.com",
  projectId: "passman-for-personal",
  storageBucket: "passman-for-personal.appspot.com",
  messagingSenderId: "82824984181",
  appId: "1:82824984181:web:915761a75a5f83d54faa3c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
