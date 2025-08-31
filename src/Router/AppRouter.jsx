import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthRouter } from "../Auth/routes/AuthRouter";
import { SistemaRouters } from "../Sistema/routes/SistemaRouters";
import { ProtectedRoute } from "../Store/authContext/ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRouter />} />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <SistemaRouters />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
