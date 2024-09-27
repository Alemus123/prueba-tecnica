import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  const handleLogout = () => {
    setUsername('');
    setUserId(null)
  };

  return (
    <UserContext.Provider value={{ username, setUsername, userId, setUserId, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
