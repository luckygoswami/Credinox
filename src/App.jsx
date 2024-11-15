import React, { useState, useEffect, useContext, useCallback } from 'react';
import { auth, db } from '../firebase-config';
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import CryptoJS from 'crypto-js';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import PasswordGenerator from './components/PasswordGenerator';
import UserContext from './context/UserContext';
import useTheme from './hooks/useTheme';

const SESSION_TIMEOUT = 15 * 60 * 1000;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [service, setService] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const { setCurrentCredential } = useContext(UserContext);
  const { theme, setTheme } = useTheme();

  const checkSession = useCallback(() => {
    const lastLoginTime = localStorage.getItem('credinoxLastLoginTime');
    if (lastLoginTime && Date.now() - Number(lastLoginTime) > SESSION_TIMEOUT) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        checkSession();
        setUser(currentUser);
        localStorage.setItem('credinoxLastLoginTime', Date.now().toString());
      } else {
        setUser(null);
        localStorage.removeItem('credinoxLastLoginTime');
      }
    });

    return () => unsubscribe();
  }, [checkSession]);

  useEffect(() => {
    if (user) {
      fetchPasswords();
      const interval = setInterval(checkSession, 60 * 1000); // Check every 1 minute
      return () => clearInterval(interval);
    }
  }, [user, checkSession]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, userEmail, userPassword);
    } catch (error) {
      console.error('Error signing up', error);
    }
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then(() => {
        localStorage.setItem('credinoxLastLoginTime', Date.now().toString());
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
    localStorage.removeItem('credinoxLastLoginTime');
    setUserPassword('');
  };

  const savePassword = async (extraFields = {}) => {
    try {
      const encryptedPassword = encryptPassword(newPassword);

      // Adding document in Firestore
      await addDoc(collection(db, 'users', user.uid, 'credentials'), {
        service,
        password: encryptedPassword,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...extraFields,
      });

      setService('');
      setNewPassword('');
      fetchPasswords();
    } catch (error) {
      console.error('Error saving credential', error);
      alert(error.message);
    }
  };

  const handleDelete = async (credentialId, credentialName) => {
    if (
      window.confirm(
        `Are you sure you want to delete '${credentialName}' credentials?`
      )
    ) {
      try {
        await deleteDoc(
          doc(db, 'users', user.uid, 'credentials', credentialId)
        );
        fetchPasswords();
      } catch (error) {
        console.error('Error deleting credential', error);
        alert(error.message);
      }
    }
  };

  const handleUpdate = async (credentialId, newCredObj) => {
    try {
      const credentialRef = doc(
        db,
        'users',
        user.uid,
        'credentials',
        credentialId
      );

      // Update the document in Firestore
      await setDoc(credentialRef, newCredObj);

      await fetchPasswords();

      setTimeout(() => {
        alert('credential updated successfully');
      }, 100);

      setCurrentCredential(null);
    } catch (error) {
      console.error('Error updating credential: ', error);
    }
  };

  const fetchPasswords = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(db, 'users', user.uid, 'credentials')
    );
    const credentialList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCredentials(credentialList);
  }, [user]);

  const DashboardProps = {
    user,
    handleLogout,
    service,
    setService,
    newPassword,
    setNewPassword,
    savePassword,
    credentials,
    encryptPassword,
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

  function ClickHoldButton() {
    const [holdTimeout, setHoldTimeout] = useState(null);
    const [isTouchEvent, setIsTouchEvent] = useState(false); // Flag to prevent duplicate events
    const holdDuration = 1000;

    const startHold = (isTouch = false) => {
      if (isTouch) {
        setIsTouchEvent(true); // Mark that a touch event has been triggered
      }

      const timeout = setTimeout(() => {
        setTheme('system');
        setHoldTimeout(null);
      }, holdDuration);

      setHoldTimeout(timeout);
    };

    const cancelHold = () => {
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        setHoldTimeout(null);

        if (!isTouchEvent) {
          if (
            theme == 'dark' ||
            (theme == 'system' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches)
          ) {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        }
      }
      setIsTouchEvent(false); // Reset the touch flag
    };

    return (
      <button
        id="`theme-btn"
        onMouseDown={() => !isTouchEvent && startHold()} // Only triggers if it's not a touch event
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={() => startHold(true)}
        onTouchEnd={cancelHold}>
        <i
          id="theme-icon"
          className={`text-2xl bi bi-${
            theme == 'dark' ||
            (theme == 'system' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches)
              ? 'moon-stars'
              : 'sun'
          }-fill`}></i>
      </button>
    );
  }

  return (
    <div className="sm:h-screen bg-gray-50 dark:bg-gray-900 grid grid-rows-[auto_1fr_auto] transition duration-300">
      <header className="bg-indigo-500 dark:bg-indigo-700 py-4 shadow-md transition duration-300">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">
            Credinox&nbsp;
            <ClickHoldButton />
          </h1>
          <p className="text-white text-lg">Your Credentials Manager</p>
        </div>
      </header>

      <main className="container mx-auto sm:my-10 flex flex-col sm:flex-row justify-between sm:px-10 overflow-auto">
        {user ? <Dashboard {...DashboardProps} /> : <AuthForm {...AuthProps} />}
        <PasswordGenerator />
      </main>

      <footer className="bg-gray-800 dark:bg-gray-700 py-4 transition duration-300">
        <div className="container mx-auto text-center text-gray-400 dark:text-gray-300 transition duration-300">
          &copy; {new Date().getFullYear()} Credinox. All rights reserved.
          <br />
          Powered by{' '}
          <a
            href="https://www.linkedin.com/in/deepakgoswamii/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 dark:text-indigo-300 hover:underline transition duration-300">
            Lucky Goswami
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
