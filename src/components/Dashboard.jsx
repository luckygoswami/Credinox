import React from "react";

function Dashboard({
  handleLogout,
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
  passwords,
  decryptPassword,
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Save a New Password
          </h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Service Name"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <li key={password.id} className="py-4 flex justify-between">
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
  );
}

export default Dashboard;
