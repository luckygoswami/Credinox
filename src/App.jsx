import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import CryptoJS from "crypto-js";

import Dashboard from "./components/Dashboard";
import AuthForm from './components/AuthForm'

function App() {
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [service, setService] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, "secret-key").toString();
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, "secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPasswords([]);
  };

  const savePassword = async () => {
    try {
      const encryptedPassword = encryptPassword(newPassword);
      await addDoc(collection(db, "users", user.uid, "passwords"), {
        service: service,
        password: encryptedPassword,
      });
      setService("");
      setNewPassword("");
      fetchPasswords();
    } catch (error) {
      console.error("Error saving password", error);
    }
  };

  const fetchPasswords = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "passwords")
    );
    const passwordList = [];
    querySnapshot.forEach((doc) => {
      passwordList.push({ id: doc.id, ...doc.data() });
    });
    setPasswords(passwordList);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchPasswords();
    });
  }, [user]);

  const DashboardProps = {
    handleLogout,
    service,
    setService,
    newPassword,
    setNewPassword,
    savePassword,
    passwords,
    decryptPassword,
  };

  const AuthProps = {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleSignUp,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 py-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">Passman</h1>
          <p className="text-white text-lg">Your Credentials Manager</p>
        </div>
      </header>

      <main className="container mx-auto mt-10">
        {user ? (
          <div className="flex flex-col items-center">
            <p className="text-xl text-gray-700 mb-4">
              Logged in as:{" "}
              <span className="font-semibold text-indigo-600">
                {user.email}
              </span>
            </p>
            <Dashboard {...DashboardProps} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <AuthForm {...AuthProps} />
          </div>
        )}
      </main>

      <footer className="bg-gray-800 py-4 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Passman. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
