import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = { id: uuidv4(), username: email.split('@')[0], email };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (username: string, email: string, password: string) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { id: uuidv4(), username, email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password changed successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};