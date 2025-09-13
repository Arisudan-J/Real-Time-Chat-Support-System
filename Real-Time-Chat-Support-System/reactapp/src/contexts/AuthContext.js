import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          // Update status to online when app loads with valid token
          updateUserStatus(decoded.id, 'ONLINE', token);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const updateUserStatus = async (userId, status, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      console.log('Status update response:', response.status);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    await updateUserStatus(decoded.id, 'ONLINE', token);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token && user) {
      await updateUserStatus(user.id, 'OFFLINE', token);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};