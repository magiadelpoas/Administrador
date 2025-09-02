

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { obtenerReservasPendientes, eliminarReserva } from '../../../../Store/reservaThunks/reservaThunks'
import { swalHelpers } from '../../../../utils/sweetalertConfig'
import $ from "jquery"
import "datatables.net"
import "datatables.net-bs5"
import "datatables.net-searchpanes-bs5"
import "datatables.net-select-bs5"
import './ListaView.css'

export const ListaView = () => {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const tableRef = useRef(null)
  const tableInstanceRef = useRef(null)

  // Cargar reservas al montar el componente
  useEffect(() => {
    cargarReservas()
    
    // Cleanup: destruir DataTable cuando el componente se desmonte
    return () => {
      if (tableInstanceRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
        tableInstanceRef.current.destroy()
        tableInstanceRef.current = null
      }
    }
  }, [])

  // Efecto para reinicializar DataTables cuando cambien los datos
  useEffect(() => {
    if (reservas.length > 0 && tableRef.current) {
      // Limpiar completamente la tabla existente
      cleanupTable()
      
      // Inicializar DataTable con un pequeño delay para asegurar limpieza
      setTimeout(() => {
        initializeDataTable()
      }, 100)
    }
  }, [reservas])

  // Función para limpiar completamente la tabla
  const cleanupTable = () => {
    if (tableRef.current) {
      // Destruir instancia de DataTable si existe
      if (tableInstanceRef.current) {
        try {
          tableInstanceRef.current.destroy()
        } catch (error) {
          console.warn('Error al destruir DataTable:', error)
        }
        tableInstanceRef.current = null
      }
      
      // Verificar y destruir con jQuery si aún existe
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        try {
          $(tableRef.current).DataTable().destroy()
        } catch (error) {
          console.warn('Error al destruir con jQuery:', error)
        }
      }
      
      // Limpiar clases y atributos de DataTable
      $(tableRef.current).removeClass('dataTable')
      $(tableRef.current).removeAttr('style')
      $(tableRef.current).find('thead, tbody').removeAttr('style')
      $(tableRef.current).find('th, td').removeAttr('style')
      
      // Remover elementos adicionales que DataTable pueda haber creado
      $(tableRef.current).parent().find('.dataTables_wrapper').remove()
    }
  }

  // Función para cargar reservas pendientes
  const cargarReservas = async (search = '') => {
    try {
      setLoading(true)
      // Obtener todas las reservas pendientes sin paginación para DataTables
      const result = await obtenerReservasPendientes(1, 1000, search)
      
      if (result.success) {
        setReservas(result.data)
      } else {
        swalHelpers.showError('Error', result.message)
      }
    } catch (error) {
      console.error('Error al cargar reservas pendientes:', error)
      swalHelpers.showError('Error', 'Error al cargar las reservas pendientes')
    } finally {
      setLoading(false)
    }
  }

  // Función para inicializar DataTables
  const initializeDataTable = () => {
    if (tableRef.current && !tableInstanceRef.current) {
      // Asegurar que la tabla esté completamente limpia
      cleanupTable()

      const isMobile = window.innerWidth <= 768;
      
      // Inicializar DataTable y guardar la instancia
      tableInstanceRef.current = $(tableRef.current).DataTable({
        language: {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ registros",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
          "sInfoPostFix":    "",
          "sSearch":         "Buscar:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
          },
          "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad"
          },
          searchPanes: {
            title: "Filtros",
            collapse: "Filtros",
            clearMessage: "Limpiar Todo",
            emptyPanes: "No hay datos para filtrar",
            count: "{total}",
            countFiltered: "{shown} ({total})",
            loadMessage: "Cargando paneles de búsqueda...",
          }
        },
        searchPanes: {
          layout: isMobile ? "columns-1" : "columns-2",
           initCollapsed: true,
           cascadePanes: true,
           dtOpts: {
             select: { style: "multi" },
             info: false,
             searching: true,
           },
           viewTotal: true,
           columns: [ 3, 4, 5, 6, 7, 8, 9, 10, 11],
         },
        pageLength: 25,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        order: [[2, 'desc']], // Ordenar por ID descendente
        columnDefs: [
          { orderable: false, targets: [0, 1] }, // Estado y Acciones no ordenables
          { width: '80px', targets: [0, 1] }, // Ancho fijo para Estado y Acciones
          { width: '100px', targets: [2] }, // Ancho fijo para ID
          { width: '150px', targets: [3, 4, 5] }, // Ancho fijo para Cabaña, Cliente, Email
          { width: '120px', targets: [6, 7, 8] }, // Ancho fijo para Personas, Depósito, Total
          { width: '180px', targets: [9] }, // Ancho fijo para Fechas
          { width: '120px', targets: [10, 11] } // Ancho fijo para Hora y Tipo Pago
        ],
        responsive: true,
        dom: 'lPBfrtip',
        buttons: [
          'searchPanes',
          'copy', 'csv', 'excel', 'pdf', 'print'
        ]
      })
    }
  }

  // Función para manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    cargarReservas(searchTerm)
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
        cargarReservas(searchTerm)
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
    
    // Formatear el número con separadores de miles
    const numeroFormateado = new Intl.NumberFormat('es-CR').format(monto)
    
    // Determinar el símbolo de moneda
    let simboloMoneda = ''
    if (moneda === 'USD' || moneda === 'Dolares') {
      simboloMoneda = '$'
    } else if (moneda === 'CRC' || moneda === 'Colones') {
      simboloMoneda = '₡'
    } else {
      simboloMoneda = moneda || '₡'
    }
    
    return `${simboloMoneda} ${numeroFormateado}`
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
              <h4 className="card-title">Lista de Reservas Pendientes</h4>
              <Link to="/reservas/crear" className="btn btn-primary">
                <i className="fas fa-plus"></i> Nueva Reserva
              </Link>
            </div>
            
            <div className="card-body">
              {/* Barra de búsqueda */}
              <div className="row mb-3">
                <div className="col-md-6">
                </div>
                <div className="col-md-6 text-end">
                  <span className="text-muted">
                    Total: {reservas.length} reservas pendientes
                  </span>
                </div>
              </div>

              {/* Tabla de reservas */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando reservas pendientes...</p>
                </div>
              ) : reservas.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No hay reservas pendientes</h5>
                  <p className="text-muted">
                    {searchTerm ? 'No se encontraron reservas pendientes con los criterios de búsqueda.' : 'No hay reservas pendientes en este momento.'}
                  </p>
                </div>
              ) : (
                                 <div className="table-responsive">
                   <table ref={tableRef} className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Estado</th>
                        <th>Acciones</th>
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
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((reserva) => (
                        <tr key={reserva.id_reserva}>
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
                            <span className={`badge ${
                              reserva.deposito_reserva === '50%' ? 'bg-danger' : 
                              reserva.deposito_reserva === '100%' ? 'bg-success' : 
                              'bg-primary'
                            }`}>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
