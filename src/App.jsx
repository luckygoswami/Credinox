import React, { useState, useEffect, useContext, useCallback } from 'react';
import { auth, db } from '../firebase-config';
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import CryptoJS from 'crypto-js';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import PasswordGenerator from './components/PasswordGenerator';
import UserContext from './context/UserContext';
import useTheme from './hooks/useTheme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import packageJson from '../package.json';

const SESSION_TIMEOUT = Number(import.meta.env.VITE_SESSION_LIMIT) * 60 * 1000;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [service, setService] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [register, setRegister] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [googleSignIn, setGoogleSignIn] = useState(true);

  const { setCurrentCredential, themeMode } = useContext(UserContext);
  const { theme, setTheme } = useTheme();

  const googleProvider = new GoogleAuthProvider();

  const handleEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Verify the email sent to you to continue using Credinox!');
    } catch (error) {
      console.error('Error sending email verification', error);
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem('signInMethod', 'google');
    } catch (error) {
      console.error('Error signing in with Google', error);
      toast.error('Error signing in with Google');
    }
  };

  const checkSession = useCallback(() => {
    const lastLoginTime = localStorage.getItem('credinoxLastLoginTime');
    if (lastLoginTime && Date.now() - Number(lastLoginTime) > SESSION_TIMEOUT) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        // set the googleSignin flag in Firestore
        if (!docSnap.exists()) {
          await setDoc(docRef, { googleSignin: googleSignIn });
        } else {
          if (!docSnap.data().hasOwnProperty('googleSignin')) {
            await updateDoc(docRef, { googleSignin: googleSignIn });
          } else {
            setGoogleSignIn(docSnap.data().googleSignin);
          }
        }

        // Login user according to their account configuration
        if (
          localStorage.getItem('signInMethod') === 'google' &&
          !(await getDoc(docRef)).data().googleSignin
        ) {
          handleLogout();
          toast.error('Google Sign In is disabled for this account!');
        } else {
          if (currentUser.emailVerified) {
            checkSession();
            setUser(currentUser);
            localStorage.setItem(
              'credinoxLastLoginTime',
              Date.now().toString()
            );
          } else {
            await handleEmailVerification();
            await handleLogout();
          }
        }
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

  useEffect(() => {
    (async () => {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          googleSignin: googleSignIn,
        });
      }
    })();
  }, [googleSignIn]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      setRegister(false);
    } catch (error) {
      console.error('Error signing up!', error);
      toast.error(error.message);
    }
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then(() => {
        localStorage.setItem('signInMethod', 'email');
      })
      .catch((error) => {
        console.log('Error signing in!', error);
        toast.error(error.message);
      });
  };

  const demoSignIn = () => {
    signInWithEmailAndPassword(
      auth,
      import.meta.env.VITE_DEMOACCOUNT_MAIL,
      import.meta.env.VITE_DEMOACCOUNT_PASSWORD
    )
      .then(() => {
        toast.success('Signed in successfully with Demo account!');
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
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
    setCurrentCredential(null);
    setCredentials([]);
    await signOut(auth);
    localStorage.removeItem('credinoxLastLoginTime');
    localStorage.removeItem('signInMethod');
    setUserPassword('');
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, userEmail);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      console.error('Error sending password reset email', error);
      toast.error(error.message);
    }
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
      toast.error('Error saving credential!');
    }
  };

  const handleImport = (data) => {
    const batch = writeBatch(db);

    data.forEach((cred) => {
      const docRef = doc(db, 'users', user.uid, 'credentials', cred.id);
      batch.set(docRef, cred);
    });

    batch
      .commit()
      .then(() => {
        toast.success('Imported credentials successfully!');
        fetchPasswords();
      })
      .catch((error) => {
        toast.success('Error while importing credendtials:', error.message);
      });
  };

  const handleDelete = async (credentialId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'credentials', credentialId));
      toast.success('Credential Deleted successfully!');
      fetchPasswords();
    } catch (error) {
      console.error('Error deleting credential', error);
      toast.error('Error deleting credential!');
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

      toast.success('Credential Updated successfully!');

      setCurrentCredential(null);
    } catch (error) {
      console.error('Error updating credential: ', error);
      toast.error('Error updating credential!');
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
    handleImport,
    credentials,
    encryptPassword,
    decryptPassword,
    handleDelete,
    handleUpdate,
    theme,
    setTheme,
    googleSignIn,
    setGoogleSignIn,
  };

  const AuthProps = {
    userEmail,
    setUserEmail,
    userPassword,
    setUserPassword,
    handleSignIn,
    handleSignUp,
    demoSignIn,
    handleGoogleSignIn,
    handleForgotPassword,
    register,
    setRegister,
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
            themeMode == 'dark' ? 'moon-stars' : 'sun'
          }-fill`}></i>
      </button>
    );
  }

  return (
    <div className="sm:h-screen bg-gray-50 dark:bg-gray-900 grid grid-rows-[auto_1fr_auto] transition duration-300">
      <header className="bg-indigo-500 dark:bg-indigo-700 py-2 shadow-md transition duration-300">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">
            Credinox&nbsp;
            <ClickHoldButton />
          </h1>
          <p className="text-white text-lg">Your Credentials Manager</p>
        </div>
      </header>

      <main className="container mx-auto sm:my-2 flex flex-col sm:flex-row justify-between sm:px-10 overflow-auto">
        {user ? <Dashboard {...DashboardProps} /> : <AuthForm {...AuthProps} />}
        <PasswordGenerator />
      </main>

      <footer className="bg-gray-800 dark:bg-gray-700 py-4 transition duration-300">
        <div className="container mx-auto text-center text-gray-400 dark:text-gray-300 transition duration-300">
          &copy; {new Date().getFullYear()}{' '}
          <span title={`v${packageJson.version}`}>Credinox.</span> All rights
          reserved.
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
      <ToastContainer
        position="top-center"
        closeOnClick={true}
        draggable={true}
        theme={themeMode}
      />
    </div>
  );
}

export default App;
