import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('r-pager-auth');
      const hasLoggedInBefore = localStorage.getItem('r-pager-has-logged-in');
      
      if (authToken === '508011') {
        setIsAuthenticated(true);
        setIsFirstLogin(!hasLoggedInBefore);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (code: string) => {
    if (code === '508011') {
      const hasLoggedInBefore = localStorage.getItem('r-pager-has-logged-in');
      setIsFirstLogin(!hasLoggedInBefore);
      
      localStorage.setItem('r-pager-auth', code);
      localStorage.setItem('r-pager-has-logged-in', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('r-pager-auth');
    setIsAuthenticated(false);
    setIsFirstLogin(false);
  };

  return {
    isAuthenticated,
    isLoading,
    isFirstLogin,
    login,
    logout
  };
};