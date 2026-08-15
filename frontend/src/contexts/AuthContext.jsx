import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ncc_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ncc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('ncc_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('ncc_token', newToken);
      localStorage.setItem('ncc_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data && res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('ncc_token', newToken);
      localStorage.setItem('ncc_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const updateUser = async (updatedData) => {
    try {
      const res = await api.put('/auth/profile', updatedData);
      if (res.data && res.data.success) {
        const freshUser = res.data.data;
        setUser(freshUser);
        localStorage.setItem('ncc_user', JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (err) {
      console.error("Error updating profile on backend:", err);
      // fallback to optimistic local update
      const fallbackUser = { ...user, ...updatedData };
      setUser(fallbackUser);
      localStorage.setItem('ncc_user', JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ncc_token');
    localStorage.removeItem('ncc_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateUser, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
