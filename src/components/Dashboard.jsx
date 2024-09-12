import React from 'react'

function Dashboard({
  handleLogout, service, setService, newPassword, setNewPassword, savePassword, passwords, decryptPassword
}) {



  return (
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
  )
}

export default Dashboard