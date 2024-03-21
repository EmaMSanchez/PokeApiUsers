
import { initializeApp } from "firebase/app";
import 'firebase/auth'
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC4_EudwSfd1AQ3QA5NDSyA4_e3xWOVc6o",
  authDomain: "pokestore-5fd2d.firebaseapp.com",
  projectId: "pokestore-5fd2d",
  storageBucket: "pokestore-5fd2d.appspot.com",
  messagingSenderId: "170361245647",
  appId: "1:170361245647:web:0d433a2003f4da49c5ccba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
export {auth, db, storage}