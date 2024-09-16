import React, { useState } from "react";
import PasswordWrapper from "./PasswordWrapper";

function AuthForm({
  userEmail,
  setUserEmail,
  userPassword,
  setUserPassword,
  handleSignIn,
  handleSignUp,
}) {
  const [passVisibility, setPassVisibility] = useState(false);

  return (
    <div className="flex items-center justify-center p-3 sm:w-[60%]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign In / Sign Up
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
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
              className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
