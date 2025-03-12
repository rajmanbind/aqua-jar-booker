
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City',
    role: 'customer'
  },
  {
    id: '2',
    name: 'Sarah Distributor',
    email: 'sarah@example.com',
    phone: '+1987654321',
    address: '456 Water Ave, City',
    role: 'distributor'
  },
  {
    id: '3',
    name: 'Mike Worker',
    email: 'mike@example.com',
    phone: '+1654987321',
    address: '789 Delivery Rd, City',
    role: 'worker'
  }
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for saved user session
    const savedUser = localStorage.getItem('aqua_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser && password === 'password') { // Simple mock password check
          setUser(foundUser);
          localStorage.setItem('aqua_user', JSON.stringify(foundUser));
          setLoading(false);
          resolve(foundUser);
        } else {
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aqua_user');
  };

  const register = async (userData: Omit<User, 'id'>): Promise<User> => {
    setLoading(true);
    // Simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          id: `user_${Date.now()}`
        };
        setUser(newUser);
        localStorage.setItem('aqua_user', JSON.stringify(newUser));
        setLoading(false);
        resolve(newUser);
      }, 800);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
