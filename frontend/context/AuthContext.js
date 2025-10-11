'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {authAPI} from '@/lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({email, password});
      console.log('API Response:', response);

      if (response.success) {
        const {token, ...userData} = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return {
          success: true,
          message: 'Login successful',
          user: userData
        };
      } else {
        // API returned success=false
        return {
          success: false,
          message: response.message || 'Invalid email or password. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data?.message || 'Invalid email or password. Please check your credentials.'
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          message: 'Unable to reach server. Please check your internet connection.'
        };
      } else {
        // Other errors
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again.'
        };
      }
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({name, email, password});

      if (response.success) {
        const {token, ...userData} = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        router.push('/dashboard');
        return {
          success: true,
          message: 'Registration successful'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);

      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};