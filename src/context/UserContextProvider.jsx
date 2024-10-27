import { useState } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
  const [currentCredential, setCurrentCredential] = useState(null);

  return (
    <UserContext.Provider value={{ currentCredential, setCurrentCredential }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
