import React, { useState } from "react";
import PasswordWrapper from "./PasswordWrapper";

function Dashboard({
  user,
  handleLogout,
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
  passwords,
  decryptPassword,
}) {
  const [passVisibility, setPassVisibility] = useState(false);

  return (
    <div className="w-[60%] h-[100%] max-w-3xl p-4">
      <div className="flex flex-col bg-white rounded-lg h-[100%] shadow-lg">
        <div className="user-info flex justify-between items-center p-3">
          <h2 className="text-2xl font-bold text-gray-800">{user.email}</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="password-fields-container overflow-auto pl-5">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Save a New Password
            </h3>
            <div className="flex flex-col gap-4">
              <input
                id="new-service"
                type="text"
                placeholder="Service Name"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <PasswordWrapper
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                passVisibility={passVisibility}
                setPassVisibility={setPassVisibility}
              />
              <button
                onClick={savePassword}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
              >
                Save Password
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Your Saved Passwords
            </h3>
            <ul className="divide-y divide-gray-200">
              {passwords.length > 0 ? (
                passwords.map((password) => (
                  <li
                    key={password.id}
                    className="py-4 flex justify-between"
                  >
                    <span className="font-medium text-gray-800">
                      {password.service}
                    </span>
                    <span className="text-gray-600">
                      {decryptPassword(password.password)}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No saved passwords yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
