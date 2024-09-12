import React from "react";

function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
  handleSignUp,
}) {
  return (
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
  );
}

export default AuthForm;
