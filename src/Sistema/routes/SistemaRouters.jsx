import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage/HomePage";
import { SistemLayout } from "../layout/SistemLayout";

export const SistemaRouters = () => {
  return (
    <SistemLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </SistemLayout>
  );
};
