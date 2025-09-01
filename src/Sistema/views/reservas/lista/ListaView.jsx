

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerReservas, eliminarReserva } from '../../../../Store/reservaThunks/reservaThunks'
import { swalHelpers } from '../../../../utils/sweetalertConfig'

export const ListaView = () => {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total_records: 0,
    total_pages: 0
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar reservas al montar el componente
  useEffect(() => {
    cargarReservas()
  }, [])

  // Función para cargar reservas
  const cargarReservas = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const result = await obtenerReservas(page, 20, search)
      
      if (result.success) {
        setReservas(result.data)
        setPagination(result.pagination || {
          current_page: 1,
          per_page: 20,
          total_records: result.data.length,
          total_pages: 1
        })
      } else {
        swalHelpers.showError('Error', result.message)
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error)
      swalHelpers.showError('Error', 'Error al cargar las reservas')
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    cargarReservas(1, searchTerm)
  }

  // Función para cambiar página
  const handlePageChange = (page) => {
    cargarReservas(page, searchTerm)
  }

  // Función para eliminar reserva
  const handleEliminar = async (id, nombreCliente) => {
    const confirmResult = await swalHelpers.showConfirmation(
      '¿Confirmar cancelación?',
      `¿Está seguro de que desea cancelar la reserva de <strong>${nombreCliente}</strong>?`,
      'Sí, cancelar'
    )

    if (!confirmResult.isConfirmed) {
      return
    }

    try {
      const result = await eliminarReserva(id)
      
      if (result.success) {
        await swalHelpers.showSuccess(
          'Reserva cancelada',
          'La reserva ha sido cancelada exitosamente'
        )
        // Recargar la lista
        cargarReservas(pagination.current_page, searchTerm)
      } else {
        swalHelpers.showError('Error', result.message)
      }
    } catch (error) {
      console.error('Error al eliminar reserva:', error)
      swalHelpers.showError('Error', 'Error al cancelar la reserva')
    }
  }

  // Función para obtener el color del badge según el estado
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'confirmado':
        return 'bg-success'
      case 'cancelado':
        return 'bg-danger'
      case 'pendiente':
        return 'bg-warning'
      default:
        return 'bg-secondary'
    }
  }

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    return new Date(fecha).toLocaleDateString('es-ES')
  }

  // Función para formatear moneda
  const formatearMoneda = (monto, moneda) => {
    if (!monto) return 'N/A'
    return `${monto} ${moneda || 'CRC'}`
  }

  // Función para formatear hora en formato 12 horas
  const formatearHora = (hora) => {
    if (!hora) return 'N/A'
    
    try {
      // Crear un objeto Date con la hora
      const [horas, minutos] = hora.split(':')
      const fecha = new Date()
      fecha.setHours(parseInt(horas), parseInt(minutos), 0)
      
      // Formatear en formato 12 horas
      return fecha.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      // Si hay error en el formato, devolver la hora original
      return hora
    }
  }

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
              {/* Barra de búsqueda */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <form onSubmit={handleSearch} className="d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Buscar por cliente, email o cabaña..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn btn-outline-primary">
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                </div>
                <div className="col-md-6 text-end">
                  <span className="text-muted">
                    Total: {pagination.total_records} reservas
                  </span>
                </div>
              </div>

              {/* Tabla de reservas */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando reservas...</p>
                </div>
              ) : reservas.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No hay reservas</h5>
                  <p className="text-muted">
                    {searchTerm ? 'No se encontraron reservas con los criterios de búsqueda.' : 'Aún no se han creado reservas.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Cabaña</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Personas</th>
                        <th>Depósito</th>
                        <th>Total</th>
                        <th>Fechas</th>
                        <th>Hora Ingreso</th>
                        <th>Tipo Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((reserva) => (
                        <tr key={reserva.id_reserva}>
                          <td>
                            <span className="badge bg-secondary">
                              #{reserva.id_reserva}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="me-2"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: reserva.cabanaColor_reserva || '#ccc'
                                }}
                              ></div>
                              <span className="fw-medium">
                                {reserva.cabanaNombre_reserva || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">
                                {reserva.nombreCliente_reserva || 'N/A'}
                              </div>
                              <small className="text-muted">
                                {reserva.nacionalidad_reserva || 'N/A'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <a href={`mailto:${reserva.emailCliente_reserva}`} className="text-decoration-none">
                              {reserva.emailCliente_reserva || 'N/A'}
                            </a>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {reserva.cantidadPersonas_reserva || 'N/A'} persona{reserva.cantidadPersonas_reserva > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-primary">
                              {reserva.deposito_reserva || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold">
                              {formatearMoneda(reserva.totalDepositado_reserva, reserva.moneda_reserva)}
                            </span>
                          </td>
                          <td>
                            <div className="small">
                              <div>
                                <i className="fas fa-sign-in-alt text-success me-1"></i>
                                {formatearFecha(reserva.fechaIngreso_reserva)}
                              </div>
                              <div>
                                <i className="fas fa-sign-out-alt text-danger me-1"></i>
                                {formatearFecha(reserva.fechaSalida_reserva)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {formatearHora(reserva.horaIngreso_reserva)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {reserva.tipoPagoPrimerDeposito_reserva || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getEstadoBadge(reserva.estado_reserva)}`}>
                              {reserva.estado_reserva || 'pendiente'}
                            </span>
                          </td>
                                                     <td>
                             <div className="d-flex gap-2">
                               <Link 
                                 to={`/reservas/editar/${reserva.id_reserva}`} 
                                 className="btn btn-sm btn-warning"
                                 title="Editar"
                               >
                                 <i className="fas fa-edit"></i>
                               </Link>
                             </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Paginación */}
              {pagination.total_pages > 1 && (
                <nav aria-label="Navegación de páginas">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>
                    
                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                      <li key={page} className={`page-item ${page === pagination.current_page ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.total_pages}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
