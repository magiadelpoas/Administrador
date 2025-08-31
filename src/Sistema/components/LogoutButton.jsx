import React from 'react';
import { useAuth } from '../../Store/authContext/AuthContext';

export const LogoutButton = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <div className="d-flex align-items-center">
      <span className="me-3">Bienvenido, {user?.name_admin}</span>
      <button 
        className="btn btn-outline-danger btn-sm"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};
