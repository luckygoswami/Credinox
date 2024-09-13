import React from 'react'
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css"

function PasswordWrapper({ passVisibility, setPassVisibility, newPassword, setNewPassword }) {

  return (
    <div className="password-wrapper relative">
      <input
        id="new-password"
        type={passVisibility ? "password" : "text"}
        placeholder="Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="p-3 pr-10  border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <button
        type="button"
        onClick={() => setPassVisibility(!passVisibility)}
        className="absolute inset-y-0 right-3 flex items-center"
      >
        <i className={`bi ${passVisibility ? "bi-eye" : "bi-eye-slash"}`}></i>
      </button>
    </div>
  )
}

export default PasswordWrapper 