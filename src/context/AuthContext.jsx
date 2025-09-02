import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('user');
    
    if (token && refreshToken && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, ...userData } = response.data;
      // Check if user is admin
      if (userData.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return false;
      }
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return !!user && user.role === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

