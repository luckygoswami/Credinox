import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase-config";
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import CryptoJS from "crypto-js";

import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";
import PasswordGenerator from "./components/PasswordGenerator";
import UserContext from "./context/UserContext";

const SESSION_TIMEOUT = 60 * 60 * 1000;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [service, setService] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const { setCurrentCredential } = useContext(UserContext);

  useEffect(() => {
    const checkSession = () => {
      const credinoxLastLoginTime = localStorage.getItem("credinoxLastLoginTime");
      if (
        credinoxLastLoginTime &&
        Date.now() - Number(credinoxLastLoginTime) > SESSION_TIMEOUT
      ) {
        handleLogout();
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        checkSession();
        setUser(currentUser);
        localStorage.setItem("credinoxLastLoginTime", Date.now().toString());
      } else {
        setUser(null);
        localStorage.removeItem("credinoxLastLoginTime");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPasswords();
      const interval = setInterval(() => {
        if (
          Date.now() - Number(localStorage.getItem("credinoxLastLoginTime")) >
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
        localStorage.setItem("credinoxLastLoginTime", Date.now().toString());
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleLogout = async () => {
    setCredentials([]);
    await signOut(auth);
    localStorage.removeItem("credinoxLastLoginTime");
    setUserPassword("");
  };

  const savePassword = async (extraFields = null) => {
    if (!service) {
      alert("Cannot leave the Service Name field empty");
    } else {
      try {
        const encryptedPassword = encryptPassword(newPassword);

        // Adding document in Firestore
        await addDoc(collection(db, "users", user.uid, "credentials"), {
          service: service,
          password: encryptedPassword,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...extraFields,
        });

        setService("");
        setNewPassword("");
        fetchPasswords();
      } catch (error) {
        console.error("Error saving credential", error);
        alert(error.message);
      }
    }
  };

  const handleDelete = async (credentialId, credentialName) => {
    // Display confirmation prompt to the user
    const confirmDelete = window.confirm(`Are you sure you want to delete '${credentialName}' credentials?`);

    // Proceed only if the user confirms
    if (confirmDelete) {
      try {
        // Delete the document in Firestore
        await deleteDoc(doc(db, "users", user.uid, "credentials", credentialId));
        await fetchPasswords();

        // A slight delay before showing the success message
        setTimeout(() => {
          alert("Credential deleted successfully");
        }, 100);
      } catch (error) {
        console.error("Error deleting credential", error);
        alert(error.message);
      }
    } else {
      // If user cancels, do nothing or show a message if needed
      console.log("Credential deletion canceled");
    }
  };

  const handleUpdate = async (credentialId, updatedService, updatedPassword) => {
    try {
      const encryptedPassword = encryptPassword(updatedPassword);
      const credentialRef = doc(db, "users", user.uid, "credentials", credentialId);

      // Update the document in Firestore
      await updateDoc(credentialRef, {
        service: updatedService,
        password: encryptedPassword,
        updatedAt: Date.now(),
      });

      await fetchPasswords();

      setTimeout(() => {
        alert("credential updated successfully");
      }, 100);

      setCurrentCredential(null);
    } catch (error) {
      console.error("Error updating credential: ", error);
    }
  };

  const fetchPasswords = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "credentials")
    );
    const passwordList = [];
    querySnapshot.forEach((doc) => {
      passwordList.push({ id: doc.id, ...doc.data() });
    });
    setCredentials(passwordList);
  };

  const DashboardProps = {
    user,
    handleLogout,
    service,
    setService,
    newPassword,
    setNewPassword,
    savePassword,
    credentials,
    decryptPassword,
    handleDelete,
    handleUpdate,
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
      <header className=" bg-[#0278ff] py-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">Credinox</h1>
          <p className="text-white text-lg">Your Credentials Manager</p>
        </div>
      </header>

      <main className="container mx-auto sm:my-10 flex flex-col sm:flex-row justify-between sm:px-10 overflow-auto">
        {user ? <Dashboard {...DashboardProps} /> : <AuthForm {...AuthProps} />}
        <PasswordGenerator />
      </main>

      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Credinox. All rights reserved. <br />
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
