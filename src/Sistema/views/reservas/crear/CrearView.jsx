import React from "react";
import { Link } from 'react-router-dom';

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
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="cliente" className="form-label">Cliente</label>
                      <input type="text" className="form-control" id="cliente" placeholder="Nombre del cliente" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" className="form-control" id="email" placeholder="email@ejemplo.com" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="fecha" className="form-label">Fecha de Reserva</label>
                      <input type="date" className="form-control" id="fecha" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="hora" className="form-label">Hora</label>
                      <input type="time" className="form-control" id="hora" />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea className="form-control" id="descripcion" rows="3" placeholder="Detalles de la reserva"></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Guardar Reserva
                  </button>
                  <Link to="/reservas/lista" className="btn btn-outline-secondary">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
