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
import AuthForm from "./components/AuthForm";
import PasswordGenerator from "./components/PasswordGenerator";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

function App() {
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [service, setService] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    const checkSession = () => {
      const passmanLastLoginTime = localStorage.getItem("passmanLastLoginTime");
      if (
        passmanLastLoginTime &&
        Date.now() - Number(passmanLastLoginTime) > SESSION_TIMEOUT
      ) {
        handleLogout();
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        checkSession();
        setUser(currentUser);
        localStorage.setItem("passmanLastLoginTime", Date.now().toString());
      } else {
        setUser(null);
        localStorage.removeItem("passmanLastLoginTime");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPasswords();
      const interval = setInterval(() => {
        if (
          Date.now() - Number(localStorage.getItem("passmanLastLoginTime")) >
          SESSION_TIMEOUT
        ) {
          handleLogout();
        }
      }, 60 * 1000); // Check every 1 minute

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, userEmail, userPassword);
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then(() => {
        console.log("Sign in successful");
        localStorage.setItem("passmanLastLoginTime", Date.now().toString());
      })
      .catch((error) => {
        console.error("Error signing in", error);
      });
  };

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, "secret-key").toString();
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, "secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleLogout = async () => {
    setPasswords([]);
    await signOut(auth);
    localStorage.removeItem("passmanLastLoginTime");
    setUserPassword("");
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

  const DashboardProps = {
    user,
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
    userEmail,
    setUserEmail,
    userPassword,
    setUserPassword,
    handleSignIn,
    handleSignUp,
  };

  return (
    <div className="sm:h-screen bg-gray-50 grid grid-rows-[auto_1fr_auto]">
      <header className="bg-indigo-600 py-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">Passman</h1>
          <p className="text-white text-lg">Your Credentials Manager</p>
        </div>
      </header>

      <main className="container mx-auto sm:my-10 flex flex-col sm:flex-row justify-between sm:px-10 overflow-auto">
        {user ? <Dashboard {...DashboardProps} /> : <AuthForm {...AuthProps} />}
        <PasswordGenerator />
      </main>

      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Passman. All rights reserved. <br />
          Powered by{" "}
          <a
            href="https://github.com/Luckygoswami"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lucky Goswami
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
