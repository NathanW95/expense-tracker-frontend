import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/authApi';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await getCurrentUser(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response: AuthResponse = await apiLogin(credentials);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('token', response.token);
  };

  const register = async (data: RegisterRequest) => {
    const response: AuthResponse = await apiRegister(data);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
