import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('user_id');
    
    console.log('🔍 Auth Check:', { token: !!token, role, userId: id });
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Listen for storage changes (login/logout events)
    const handleStorageChange = () => {
      console.log('📦 Storage changed, rechecking auth');
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for immediate auth updates
    window.addEventListener('authChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  const login = (token, role, id) => {
    console.log('✅ Login called with:', { token: !!token, role, id });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', id.toString());
    
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
    
    // Trigger custom auth change event
    window.dispatchEvent(new Event('authChange'));
  };

  const logout = () => {
    console.log('🚪 Logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    
    // Trigger custom auth change event
    window.dispatchEvent(new Event('authChange'));
  };

  const isAdmin = () => userRole === 'admin';
  const isUser = () => userRole === 'user';

  return {
    isAuthenticated,
    userRole,
    userId,
    loading,
    login,
    logout,
    isAdmin,
    isUser,
    checkAuth
  };
};
