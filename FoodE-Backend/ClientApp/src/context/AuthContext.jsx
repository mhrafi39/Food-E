import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('food-e-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('food-e-token');
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('food-e-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('food-e-user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('food-e-token', token);
    } else {
      localStorage.removeItem('food-e-token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Login failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(userData);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, phoneNumber, address) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phoneNumber, address }),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Registration failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const userData = {
        userId: data.userId,
        name: data.name,
        role: data.role,
        email: data.email,
      };

      setUser(userData);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('food-e-user');
    localStorage.removeItem('food-e-token');
  };

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
