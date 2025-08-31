import React from 'react'
import { LoginPage } from '../pages/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../Store/authContext/AuthContext'

export const AuthRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir al sistema
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
