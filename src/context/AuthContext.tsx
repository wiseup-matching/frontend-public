import { socket } from '@/socket';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  userType: 'Retiree' | 'Startup';
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async (): Promise<void> => {
    try {
      const url = import.meta.env.VITE_API_BASE_URL + '/me'; // changed from /auth/me
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        if (socket.disconnected) {
          socket.connect();
        }
        socket.emit('authenticate');
      } else {
        setUser(null);
        // Only redirect if we're not already on a public page
        const publicPaths = [
          '/',
          '/login',
          '/signup',
          '/imprint',
          '/privacy',
          '/terms',
          '/for-startups',
          '/for-retirees',
        ];
        const currentPath = window.location.pathname;

        if (!publicPaths.includes(currentPath)) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setUser(null);
      const publicPaths = [
        '/',
        '/login',
        '/signup',
        '/imprint',
        '/privacy',
        '/for-startups',
        '/for-retirees',
      ];
      const currentPath = window.location.pathname;

      if (!publicPaths.includes(currentPath)) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(import.meta.env.VITE_API_BASE_URL + '/logout', {
        // changed from /auth/logout
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchUser();
  };

  useEffect(() => {
    // Increased delay to ensure cookies are set after magic link verification
    // and allow enough time for the browser to process the cookie
    const timer = setTimeout(() => {
      fetchUser();
    }, 200);

    return () => clearTimeout(timer);
  }, [navigate]);

  const value: AuthContextType = {
    user,
    loading,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
