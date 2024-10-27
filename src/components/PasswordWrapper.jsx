import React from 'react';
import '../../node_modules/bootstrap-icons/font/bootstrap-icons.css';

function PasswordWrapper({
  passVisibility,
  setPassVisibility,
  value,
  onChange,
}) {
  return (
    <div className="password-wrapper relative">
      <input
        id="new-password"
        type={passVisibility ? 'text' : 'password'}
        placeholder="Password"
        value={value}
        onChange={onChange}
        className="p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 w-full transition duration-300"
      />
      <button
        type="button"
        tabIndex="-1"
        onClick={() => setPassVisibility(!passVisibility)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-400 transition duration-300">
        <i className={`bi ${passVisibility ? 'bi-eye' : 'bi-eye-slash'}`}></i>
      </button>
    </div>
  );
}

export default PasswordWrapper;
