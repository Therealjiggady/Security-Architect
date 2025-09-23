import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // In a real app, check for token in cookies/localStorage and validate
      // For now, just set loading to false
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Store token if needed
  };

  const logout = () => {
    setUser(null);
    // Clear token
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};