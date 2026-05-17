import React, { useCallback, useMemo, useState } from 'react';
import api from '../api';
import { AuthContext } from './authContextValue';

const TOKEN_KEY = 'lumiere_auth_token';
const USER_KEY = 'lumiere_auth_user';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);

  const persistSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, nextToken);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    persistSession(response.data.user, response.data.token);
    return response.data.user;
  }, [persistSession]);

  const signup = useCallback(async ({ name, email, password }) => {
    const response = await api.post('/auth/signup', { name, email, password });
    persistSession(response.data.user, response.data.token);
    return response.data.user;
  }, [persistSession]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    signup,
    token,
    user
  }), [login, logout, signup, token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
