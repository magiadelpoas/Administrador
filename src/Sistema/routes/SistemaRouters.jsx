import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage/HomePage";
import { SistemLayout } from "../layout/SistemLayout";
import { ReservaPage } from "../pages/ReservasPage/ReservaPage";

export const SistemaRouters = () => {
  return (
    <SistemLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservas/*" element={<ReservaPage />} />
      </Routes>
    </SistemLayout>
  );
};
