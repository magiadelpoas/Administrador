import React from "react";
import { Link } from "react-router-dom";

export const CrearView = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">Crear Nueva Reserva</h4>
              <Link to="/reservas/lista" className="btn btn-secondary">
                <i className="fas fa-arrow-left"></i> Volver a Lista
              </Link>
            </div>
            <div className="card-body"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
