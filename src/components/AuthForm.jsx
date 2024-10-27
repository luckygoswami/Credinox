import React, { useState, useEffect } from 'react';
import PasswordWrapper from './PasswordWrapper';

function AuthForm({
  userEmail,
  setUserEmail,
  userPassword,
  setUserPassword,
  handleSignIn,
  handleSignUp,
}) {
  const [passVisibility, setPassVisibility] = useState(false);

  // Event handler for keydown
  const handleKeyDown = (e) => {
    e.key === 'Enter' && handleSignIn();
  };

  useEffect(() => {
    const inputElement = document.getElementById('new-password');
    inputElement.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [userPassword, userEmail]);

  return (
    <div className="flex items-center justify-center p-3 sm:w-[60%]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transition duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6 transition duration-300">
          Sign In / Sign Up
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 transition duration-300"
          />
          <PasswordWrapper
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            passVisibility={passVisibility}
            setPassVisibility={setPassVisibility}
          />
          <div className="flex justify-between space-x-2">
            <button
              onClick={handleSignIn}
              className="w-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition duration-300">
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
