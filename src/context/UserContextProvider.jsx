import { useState } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
  const [currentCredential, setCurrentCredential] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

  return (
    <UserContext.Provider
      value={{
        currentCredential,
        setCurrentCredential,
        themeMode,
        setThemeMode,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
