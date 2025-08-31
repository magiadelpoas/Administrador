

import React from 'react'
import { Link } from 'react-router-dom'

export const ListaView = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">Lista de Reservas</h4>
              <Link to="/reservas/crear" className="btn btn-primary">
                <i className="fas fa-plus"></i> Nueva Reserva
              </Link>
            </div>
            <div className="card-body">
              <p>Aquí se mostrará la lista de todas las reservas del sistema.</p>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Juan Pérez</td>
                      <td>2024-01-15</td>
                      <td><span className="badge bg-success">Confirmada</span></td>
                      <td>
                        <Link to="/reservas/editar" className="btn btn-sm btn-warning me-2">
                          <i className="fas fa-edit"></i> Editar
                        </Link>
                        <button className="btn btn-sm btn-danger">
                          <i className="fas fa-trash"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
