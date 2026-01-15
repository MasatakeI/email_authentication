// src/firebase/auth.js

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCx8FMV4RS_Kvdcja3md5dERbrC5oTKcRk",
  authDomain: "email-authentication-7203a.firebaseapp.com",
  projectId: "email-authentication-7203a",
  storageBucket: "email-authentication-7203a.firebasestorage.app",
  messagingSenderId: "9836675212",
  appId: "1:9836675212:web:b45d7c2fc302a767f7fba9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
