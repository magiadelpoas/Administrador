import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginThunk, logoutThunk, checkAuthThunk } from '../authThunks/authThunks';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si el token ha expirado
  const isTokenExpired = (expiresAt) => {
    if (!expiresAt) return true;
    
    const expirationDate = new Date(expiresAt);
    const currentDate = new Date();
    
    return currentDate > expirationDate;
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await checkAuthThunk()();
        
        if (result.success) {
          // Verificar si el token ha expirado
          const adminData = JSON.parse(localStorage.getItem('adminData'));
          const expiresAt = localStorage.getItem('tokenExpiresAt');
          
          if (isTokenExpired(expiresAt)) {
            // Token expirado, cerrar sesión
            await handleLogout();
            return;
          }
          
          setIsAuthenticated(true);
          setUser(result.data.admin);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Función de login
  const handleLogin = async (email, password) => {
    try {
      const result = await loginThunk(email, password)();
      
      if (result.success) {
        // Guardar la fecha de expiración
        localStorage.setItem('tokenExpiresAt', result.data.expires_at);
        
        setIsAuthenticated(true);
        setUser(result.data.admin);
        
        return {
          success: true,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: "Error de conexión. Intente nuevamente."
      };
    }
  };

  // Función de logout
  const handleLogout = async () => {
    try {
      await logoutThunk()();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('tokenExpiresAt');
    }
  };

  // Verificar token periódicamente
  useEffect(() => {
    if (isAuthenticated) {
      const checkTokenExpiration = () => {
        const expiresAt = localStorage.getItem('tokenExpiresAt');
        
        if (isTokenExpired(expiresAt)) {
          handleLogout();
        }
      };

      // Verificar cada minuto
      const interval = setInterval(checkTokenExpiration, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
