import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import CryptoJS from "crypto-js";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchPasswords();
    });
  }, [user]);

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, "secret-key").toString();
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, "secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

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

  return (
    <div className="App">
      <h1>Passman: Your Password Manager</h1>
      {user ? (
        <p>logged in as: {user.email}</p>
      ) : ''}
      {user ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h2>Save a new password</h2>
          <input
            type="text"
            placeholder="Service Name"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={savePassword}>Save Password</button>

          <h2>Your Saved Passwords</h2>
          <ul>
            {passwords.map((password) => (
              <li key={password.id}>
                <strong>{password.service}:</strong>{" "}
                {decryptPassword(password.password)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Sign In / Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default App;
