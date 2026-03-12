import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user session
    const storedUser = localStorage.getItem('lampStoreUser');
    const storedToken = localStorage.getItem('lampStoreToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('lampStoreUser', JSON.stringify(userData));
    localStorage.setItem('lampStoreToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lampStoreUser');
    localStorage.removeItem('lampStoreToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
