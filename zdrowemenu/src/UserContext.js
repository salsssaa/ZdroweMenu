import React, { createContext, useState, useContext } from 'react';
import { getCurrentUser, updateUserProfile } from './auth/AuthService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funkcja do pobierania danych użytkownika
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }; // DODANO BRAKUJĄCY NAWIAS

  // Funkcja do aktualizacji danych użytkownika
  const updateUser = async (userData) => {
    setIsLoading(true);
    try {
      const updatedUser = await updateUserProfile(userData);
      setUser(updatedUser);
      setError(null);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }; // DODANO BRAKUJĄCY NAWIAS

  const value = {
    user,
    setUser,
    isLoading,
    error,
    fetchUser,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  ); // POPRAWIONO JSX
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; // DODANO BRAKUJĄCY NAWIAS
