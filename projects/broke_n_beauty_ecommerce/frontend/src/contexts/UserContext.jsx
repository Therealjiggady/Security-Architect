import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const UserContext = createContext();

const API_BASE = API_URL;

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

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Session check failed:', err);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errorData.detail || 'Invalid email or password');
      }
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      // Fetch user data
      const userRes = await fetch(`${API_BASE}/users/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` },
      });
      const userData = await userRes.json();
      setUser(userData);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (email, password, full_name) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(errorData.detail || 'Email already exists or invalid data');
      }
      // After registration, login to get token
      await login(email, password);
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Profile update failed');
      const updatedUser = await res.json();
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Profile update error:', err);
      throw err;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};