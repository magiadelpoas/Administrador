import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
  Box,
  OutlinedInput
} from '@mui/material';
import { 
  useReservaForm, 
  opcionesDeposito, 
  opcionesMoneda, 
  opcionesTipoPago,
  opcionesTipoReserva,
  opcionesExtras,
  nacionalidades,
  opcionesMascotas,
  validateForm,
  getValidationClasses
} from "../utils/ReservaUtils";
import { 
  actualizarReserva, 
  obtenerReservaPorId, 
  confirmarReserva, 
  cancelarReserva, 
  reactivarReserva 
} from "../../../../Store/reservaThunks/reservaThunks";
import { swalHelpers } from "../../../../utils/sweetalertConfig";

/**
 * ========================================
 * COMPONENTE: EditarView
 * ========================================
 * Componente para editar reservas existentes. Renderiza un formulario completo
 * que permite al usuario modificar todos los datos de una reserva existente.
 * 
 * CARACTERÍSTICAS:
 * - Formulario responsivo (mobile, tablet, desktop)
 * - Validación de campos obligatorios
 * - Carga de imágenes con preview
 * - Selección múltiple de extras usando Material-UI
 * - Campos condicionales (se muestran solo después de seleccionar cabaña y tipo de reserva)
 * - Carga automática de datos de la reserva desde la API
 * 
 * @returns {JSX.Element} Formulario de edición de reserva
 */
export const EditarView = () => {
  const { id } = useParams(); // Obtener el ID de la URL
  const [loading, setLoading] = useState(true);
  const [reservaData, setReservaData] = useState(null);
  const [error, setError] = useState(null);

  // ===== CARGA DE DATOS DE LA RESERVA =====
  useEffect(() => {
    const cargarReserva = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Intentando obtener reserva con ID:', id);
        const result = await obtenerReservaPorId(id);
        console.log('Resultado de obtenerReservaPorId:', result);
        
        if (result.success) {
          // Mapear los datos de la API al formato esperado por el formulario
          const datosMapeados = {
            cabañaId: result.data.cabanaId_reserva,
            nombreCliente: result.data.nombreCliente_reserva,
            emailCliente: result.data.emailCliente_reserva,
            telefono: result.data.telefono_reserva || '00',
            nacionalidad: result.data.nacionalidad_reserva,
            mascotas: result.data.mascotas_reserva,
            cantidadPersonas: result.data.cantidadPersonas_reserva,
            deposito: result.data.deposito_reserva,
            moneda: result.data.moneda_reserva,
            totalDepositado: result.data.totalDepositado_reserva,
            horaIngreso: result.data.horaIngreso_reserva,
            horaSalida: result.data.horaSalida_reserva,
            fechaIngreso: result.data.fechaIngreso_reserva,
            fechaSalida: result.data.fechaSalida_reserva,
            tipoPagoPrimerDeposito: result.data.tipoPagoPrimerDeposito_reserva,
            tipoPagoSegundoDeposito: result.data.tipoPagoSegundoDeposito_reserva,
            tipoReserva: result.data.tipoReserva_reserva,
            extras: result.data.extras_reserva ? JSON.parse(result.data.extras_reserva) : [],
            estado: result.data.estado_reserva || 'pendiente',
            primerDepositoPreview: result.data.primerDeposito_reserva ? 
              `https://apimagia.magiadelpoas.com/imgComprobantes/${result.data.primerDeposito_reserva}` : null,
            segundoDepositoPreview: result.data.segundoDeposito_reserva ? 
              `https://apimagia.magiadelpoas.com/imgComprobantes/${result.data.segundoDeposito_reserva}` : null
          };
          
          setReservaData(datosMapeados);
        } else {
          setError(result.message);
          await swalHelpers.showError('Error', result.message);
        }
      } catch (error) {
        console.error('Error al cargar la reserva:', error);
        setError('Error al cargar los datos de la reserva');
        await swalHelpers.showError('Error', 'Error al cargar los datos de la reserva');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarReserva();
    }
  }, [id]);

  // ===== HOOK PERSONALIZADO =====
  // Obtener toda la lógica del formulario desde el hook personalizado
  const {
    cabañaSeleccionada,
    formData,
    primerDeposito,
    segundoDeposito,
    primerDepositoPreview,
    segundoDepositoPreview,
    cabañas,
    cabañaActual,
    capacidadMaxima,
    touchedFields,
    handleCabañaChange,
    handleInputChange,
    handleExtrasChange,
    handleFileChange,
    handleRemoveFile,
    handleSubmit
  } = useReservaForm(reservaData);

  // ===== MANEJADORES DE CAMBIO DE ESTADO =====
  
  /**
   * Maneja la confirmación de una reserva
   */
  const handleConfirmarReserva = async () => {
    const confirmResult = await swalHelpers.showConfirmation(
      '¿Confirmar esta reserva?',
      `
        <div class="text-start">
          <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
          <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
          <p><strong>Fechas:</strong> ${formData.fechaIngreso} - ${formData.fechaSalida}</p>
          <p><strong>ID de Reserva:</strong> ${id}</p>
          <p class="text-warning mt-2"><i class="fas fa-exclamation-triangle me-1"></i>Una vez confirmada, no se podrá cancelar.</p>
        </div>
      `,
      'Sí, confirmar reserva'
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      swalHelpers.showLoading('Confirmando reserva...', 'Procesando confirmación');
      
      const result = await confirmarReserva(id);
      
      if (result.success) {
        await swalHelpers.showSuccess(
          '¡Reserva confirmada exitosamente!',
          `La reserva de ${cabañaActual?.nombre} ha sido confirmada.`
        );
        
        // Recargar los datos de la reserva
        window.location.reload();
      } else {
        swalHelpers.showError('Error al confirmar la reserva', result.message);
      }
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      swalHelpers.showError('Error inesperado', 'Ocurrió un error al confirmar la reserva.');
    }
  };

  /**
   * Maneja la cancelación de una reserva
   */
  const handleCancelarReserva = async () => {
    const confirmResult = await swalHelpers.showConfirmation(
      '¿Cancelar esta reserva?',
      `
        <div class="text-start">
          <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
          <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
          <p><strong>Fechas:</strong> ${formData.fechaIngreso} - ${formData.fechaSalida}</p>
          <p><strong>ID de Reserva:</strong> ${id}</p>
          <p class="text-warning mt-2"><i class="fas fa-exclamation-triangle me-1"></i>Esta acción se puede revertir más tarde.</p>
        </div>
      `,
      'Sí, cancelar reserva',
      'btn-danger'
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      swalHelpers.showLoading('Cancelando reserva...', 'Procesando cancelación');
      
      const result = await cancelarReserva(id);
      
      if (result.success) {
        await swalHelpers.showSuccess(
          '¡Reserva cancelada exitosamente!',
          `La reserva de ${cabañaActual?.nombre} ha sido cancelada.`
        );
        
        // Recargar los datos de la reserva
        window.location.reload();
      } else {
        swalHelpers.showError('Error al cancelar la reserva', result.message);
      }
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      swalHelpers.showError('Error inesperado', 'Ocurrió un error al cancelar la reserva.');
    }
  };

  /**
   * Maneja la reactivación de una reserva cancelada
   */
  const handleReactivarReserva = async () => {
    const confirmResult = await swalHelpers.showConfirmation(
      '¿Reactivar esta reserva?',
      `
        <div class="text-start">
          <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
          <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
          <p><strong>Fechas:</strong> ${formData.fechaIngreso} - ${formData.fechaSalida}</p>
          <p><strong>ID de Reserva:</strong> ${id}</p>
          <p class="text-info mt-2"><i class="fas fa-info-circle me-1"></i>La reserva volverá al estado pendiente.</p>
        </div>
      `,
      'Sí, reactivar reserva'
    );

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      swalHelpers.showLoading('Reactivando reserva...', 'Procesando reactivación');
      
      const result = await reactivarReserva(id);
      
      if (result.success) {
        await swalHelpers.showSuccess(
          '¡Reserva reactivada exitosamente!',
          `La reserva de ${cabañaActual?.nombre} ha sido reactivada.`
        );
        
        // Recargar los datos de la reserva
        window.location.reload();
      } else {
        swalHelpers.showError('Error al reactivar la reserva', result.message);
      }
    } catch (error) {
      console.error('Error al reactivar reserva:', error);
      swalHelpers.showError('Error inesperado', 'Ocurrió un error al reactivar la reserva.');
    }
  };

  // ===== MANEJADOR DE ENVÍO =====
  /**
   * Maneja el envío del formulario para actualizar una reserva existente
   * @param {Event} e - Evento del formulario
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el formulario con los archivos
    const errors = validateForm(formData, cabañaSeleccionada, primerDeposito, segundoDeposito);
    if (errors.length > 0) {
      await swalHelpers.showValidationError(errors);
      return;
    }
    
    // ===== DATOS COMPLETOS QUE SE ENVIARÁN =====
    const datosCompletos = {
      // Datos de la cabaña (usar nombres sin caracteres especiales)
      cabanaId: cabañaSeleccionada,
      cabanaNombre: cabañaActual?.nombre || "",
      cabanaColor: cabañaActual?.color || "",
      
      // Todos los campos del formData
      ...formData,
      
      // Flag de edición
      isEdit: true
    };

    // Confirmar actualización de la reserva
    const confirmResult = await swalHelpers.showConfirmation(
      '¿Confirmar actualización de reserva?',
      `
        <div class="text-start">
          <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
          <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
          <p><strong>Fechas:</strong> ${formData.fechaIngreso} - ${formData.fechaSalida}</p>
          <p><strong>Total:</strong> ${formData.totalDepositado} ${formData.moneda}</p>
          <p><strong>ID de Reserva:</strong> ${id}</p>
        </div>
      `,
      'Sí, actualizar reserva'
    );

    if (!confirmResult.isConfirmed) {
      return;
    }
    
    try {
      // Mostrar loading con SweetAlert
      swalHelpers.showLoading(
        'Actualizando reserva...',
        `
          <div class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Procesando cambios para la reserva de <strong>${cabañaActual?.nombre}</strong></p>
          </div>
        `
      );
      
      // Preparar datos para envío usando el hook
      const submitData = handleSubmit(e, true);
      
      // Llamar a la API para actualizar la reserva
      const result = await actualizarReserva(id, submitData);
      
      if (result.success) {
        await swalHelpers.showSuccess(
          '¡Reserva actualizada exitosamente!',
          `
            <div class="text-start">
              <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
              <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
              <p><strong>ID de Reserva:</strong> ${id}</p>
              ${result.changes ? `<p><strong>Campos actualizados:</strong> ${result.changes}</p>` : ''}
            </div>
          `
        );
        
        // Redirigir a la lista de reservas
        window.location.href = '/reservas/listar';
      } else {
        swalHelpers.showError('Error al actualizar la reserva', result.message);
      }
      
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      swalHelpers.showError(
        'Error inesperado',
        'Ocurrió un error inesperado al actualizar la reserva. Por favor, inténtelo de nuevo.'
      );
    }
  };

  // ===== ESTADOS DE CARGA Y ERROR =====
  if (loading) {
    return (
      <div className="container-fluid px-3 px-md-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h5>Cargando datos de la reserva...</h5>
                <p className="text-muted">Por favor espere mientras se cargan los datos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-3 px-md-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h5>Error al cargar la reserva</h5>
                <p className="text-muted">{error}</p>
                <Link to="/reservas/listar" className="btn btn-primary">
                  <i className="fas fa-arrow-left"></i> Volver a la lista
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== CONDICIÓN DE VISUALIZACIÓN =====
  // Los campos adicionales solo se muestran después de seleccionar cabaña y tipo de reserva
  const ambosSeleccionados = cabañaSeleccionada && formData.tipoReserva;
  
  // Condición para mostrar campos del segundo depósito (solo si depósito es 50%)
  const mostrarSegundoDeposito = formData.deposito === "50%";
  
  // Condición para deshabilitar el formulario si la reserva está confirmada
  const isFormDisabled = reservaData?.estado === 'confirmado';

  return (
    <div className="container-fluid px-3 px-md-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            {/* ===== HEADER DEL CARD ===== */}
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                <h4 className="card-title mb-0">Editar Reserva #{id}</h4>
                {/* Indicador de estado */}
                {reservaData && (
                  <span className={`badge ${
                    reservaData.estado === 'pendiente' ? 'bg-warning text-dark' :
                    reservaData.estado === 'confirmado' ? 'bg-success' :
                    reservaData.estado === 'cancelado' ? 'bg-danger' : 'bg-secondary'
                  } fs-6`}>
                    <i className={`fas ${
                      reservaData.estado === 'pendiente' ? 'fa-clock' :
                      reservaData.estado === 'confirmado' ? 'fa-check-circle' :
                      reservaData.estado === 'cancelado' ? 'fa-times-circle' : 'fa-question-circle'
                    } me-1`}></i>
                    {reservaData.estado.charAt(0).toUpperCase() + reservaData.estado.slice(1)}
                  </span>
                )}
              </div>
              <Link to="/reservas/listar" className="btn btn-secondary btn-sm">
                <i className="fas fa-arrow-left"></i> 
                <span className="d-none d-sm-inline ms-1">Volver a Lista</span>
                <span className="d-sm-none">Volver</span>
              </Link>
            </div>
            
            {/* ===== CUERPO DEL FORMULARIO ===== */}
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* ===== SECCIÓN 1: SELECCIÓN INICIAL ===== */}
                {/* Selección de Cabaña y Tipo de Reserva - Ancho completo */}
                <div className="row mb-4">
                  {/* Campo: Seleccionar Cabaña */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="cabañaId" className="form-label">
                      Seleccionar Cabaña <span className="text-danger">*</span>
                    </label>
                    <select
                      className={getValidationClasses("cabañaId", formData, touchedFields, cabañaSeleccionada)}
                      id="cabañaId"
                      value={cabañaSeleccionada}
                      onChange={handleCabañaChange}
                      required
                      disabled={isFormDisabled}
                    >
                      <option value="">Seleccione una cabaña</option>
                      {cabañas.map((cabaña) => (
                        <option 
                          key={cabaña.id} 
                          value={cabaña.id}
                        >
                          {cabaña.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Campo: Tipo de Reserva */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="tipoReserva" className="form-label">
                      Tipo de Reserva <span className="text-danger">*</span>
                    </label>
                    <select
                      className={getValidationClasses("tipoReserva", formData, touchedFields)}
                      id="tipoReserva"
                      name="tipoReserva"
                      value={formData.tipoReserva}
                      onChange={handleInputChange}
                      required
                      disabled={isFormDisabled}
                    >
                      {opcionesTipoReserva.map(opcion => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ===== SECCIÓN 2: ALERT DE CABAÑA SELECCIONADA ===== */}
                {/* Alert que muestra la cabaña seleccionada con su color */}
                {cabañaActual && (
                  <div className="row mb-4">
                    <div className="col-12">
                      <div 
                        className="alert alert-info d-flex align-items-center" 
                        role="alert"
                        style={{ 
                          borderLeft: `4px solid ${cabañaActual.color}`,
                          backgroundColor: `${cabañaActual.color}15`
                        }}
                      >
                        <div 
                          className="me-2 flex-shrink-0"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: cabañaActual.color
                          }}
                        ></div>
                        <div className="flex-grow-1">
                          <strong>Has seleccionado la cabaña:</strong> {cabañaActual.nombre}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== BOTONES DE ESTADO (ARRIBA) ===== */}
                {ambosSeleccionados && reservaData && (
                  <div className="row mb-4">
                    <div className="col-12">
                      {/* Botones de estado para reserva pendiente */}
                      {reservaData.estado === 'pendiente' && (
                        <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                          <button 
                            type="button" 
                            className="btn btn-success"
                            onClick={handleConfirmarReserva}
                          >
                            <i className="fas fa-check"></i> 
                            <span className="ms-1">Confirmar Reserva</span>
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick={handleCancelarReserva}
                          >
                            <i className="fas fa-times"></i> 
                            <span className="ms-1">Cancelar Reserva</span>
                          </button>
                        </div>
                      )}

                      {/* Botón de reactivar para reserva cancelada */}
                      {reservaData.estado === 'cancelado' && (
                        <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                          <div className="alert alert-warning mb-2 w-100">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Esta reserva está <strong>cancelada</strong>. Solo puedes reactivarla.
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleReactivarReserva}
                          >
                            <i className="fas fa-undo"></i> 
                            <span className="ms-1">Reactivar Reserva</span>
                          </button>
                        </div>
                      )}

                      {/* Mensaje para reserva confirmada */}
                      {reservaData.estado === 'confirmado' && (
                        <div className="alert alert-success mb-3">
                          <i className="fas fa-check-circle me-2"></i>
                          Esta reserva ya está <strong>confirmada</strong>. No se pueden realizar más cambios.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ===== SECCIÓN 3: CAMPOS ADICIONALES (CONDICIONALES) ===== */}
                {ambosSeleccionados && (
                  <>
                    {/* ===== SECCIÓN 3.1: CAMPOS QUE EL USUARIO DEBE LLENAR ===== */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="text-primary mb-3">
                          <i className="fas fa-edit me-2"></i>
                          Información Requerida
                        </h5>
                        {isFormDisabled ? (
                          <div className="alert alert-warning">
                            <i className="fas fa-lock me-2"></i>
                            Esta reserva está <strong>confirmada</strong> y no se pueden modificar sus datos.
                          </div>
                        ) : (
                          <div className="alert alert-info">
                            <i className="fas fa-info-circle me-2"></i>
                            Complete los siguientes campos para actualizar la reserva
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="row">
                      {/* ===== COLUMNA IZQUIERDA ===== */}
                      <div className="col-12 col-lg-6">
                        <div className="row">
                          {/* Campo: Nombre del Cliente */}
                          <div className="col-12 mb-3">
                            <label htmlFor="nombreCliente" className="form-label">
                              Nombre del Cliente <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={getValidationClasses("nombreCliente", formData, touchedFields)}
                              id="nombreCliente"
                              name="nombreCliente"
                              value={formData.nombreCliente}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Cantidad de Personas */}
                          <div className="col-12 mb-3">
                            <label htmlFor="cantidadPersonas" className="form-label">
                              Cantidad de Personas <span className="text-danger">*</span>
                            </label>
                            <select
                              className={getValidationClasses("cantidadPersonas", formData, touchedFields)}
                              id="cantidadPersonas"
                              name="cantidadPersonas"
                              value={formData.cantidadPersonas}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Seleccione cantidad de personas</option>
                              {capacidadMaxima && Array.from({ length: capacidadMaxima }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>
                                  {num} persona{num > 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                            {/* Mensaje de capacidad máxima */}
                            {capacidadMaxima && (
                              <div className="form-text text-info">
                                <i className="fas fa-info-circle me-1"></i>
                                La cabaña seleccionada permite máximo {capacidadMaxima} persona{capacidadMaxima > 1 ? 's' : ''}.
                              </div>
                            )}
                          </div>
                          
                          {/* Campo: Total Depositado */}
                          <div className="col-12 mb-3">
                            <label htmlFor="totalDepositado" className="form-label">
                              Total Depositado <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={getValidationClasses("totalDepositado", formData, touchedFields)}
                              id="totalDepositado"
                              name="totalDepositado"
                              min="0"
                              step="0.01"
                              value={formData.totalDepositado}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Fecha de Ingreso */}
                          <div className="col-12 mb-3">
                            <label htmlFor="fechaIngreso" className="form-label">
                              Fecha de Ingreso <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className={getValidationClasses("fechaIngreso", formData, touchedFields)}
                              id="fechaIngreso"
                              name="fechaIngreso"
                              value={formData.fechaIngreso}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Fecha de Salida */}
                          <div className="col-12 mb-3">
                            <label htmlFor="fechaSalida" className="form-label">
                              Fecha de Salida <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className={getValidationClasses("fechaSalida", formData, touchedFields)}
                              id="fechaSalida"
                              name="fechaSalida"
                              value={formData.fechaSalida}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Extras (Selección múltiple con Material-UI) */}
                          <div className="col-12 mb-3">
                            <FormControl fullWidth>
                              <InputLabel id="extras-label">Extras (Selección múltiple)</InputLabel>
                              <Select
                                labelId="extras-label"
                                id="extras"
                                multiple
                                value={formData.extras}
                                onChange={handleExtrasChange}
                                input={<OutlinedInput label="Extras (Selección múltiple)" />}
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip key={value} label={value} size="small" />
                                    ))}
                                  </Box>
                                )}
                              >
                                {opcionesExtras.map((extra) => (
                                  <MenuItem key={extra} value={extra}>
                                    {extra}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </div>

                      {/* ===== COLUMNA DERECHA ===== */}
                      <div className="col-12 col-lg-6">
                        <div className="row">
                          {/* Campo: Hora de Ingreso */}
                          <div className="col-12 mb-3">
                            <label htmlFor="horaIngreso" className="form-label">
                              Hora de Ingreso <span className="text-danger">*</span>
                            </label>
                            <input
                              type="time"
                              className={getValidationClasses("horaIngreso", formData, touchedFields)}
                              id="horaIngreso"
                              name="horaIngreso"
                              value={formData.horaIngreso}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Hora de Salida */}
                          <div className="col-12 mb-3">
                            <label htmlFor="horaSalida" className="form-label">
                              Hora de Salida <span className="text-danger">*</span>
                            </label>
                            <input
                              type="time"
                              className={getValidationClasses("horaSalida", formData, touchedFields)}
                              id="horaSalida"
                              name="horaSalida"
                              value={formData.horaSalida}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Primer Depósito (Imagen) */}
                          <div className="col-12 mb-3">
                            <label htmlFor="primerDeposito" className="form-label">
                              Primer Depósito (Imagen)
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="primerDeposito"
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={(e) => handleFileChange(e, 'primer')}
                              disabled={isFormDisabled}
                            />
                            {/* Preview de la imagen del primer depósito */}
                            {primerDepositoPreview && (
                              <div className="mt-3">
                                <div className="d-flex align-items-start gap-2">
                                  <div className="position-relative">
                                    <img
                                      src={primerDepositoPreview}
                                      alt="Preview Primer Depósito"
                                      className="img-thumbnail"
                                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                                    />
                                    {/* Indicador de cambio */}
                                    {touchedFields.primerDepositoChanged && (
                                      <span 
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning"
                                        title="Archivo modificado"
                                      >
                                        <i className="fas fa-edit"></i>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-grow-1">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRemoveFile('primer')}
                                      disabled={isFormDisabled}
                                    >
                                      <i className="fas fa-times me-1"></i>
                                      Eliminar
                                    </button>
                                    <div className="mt-1">
                                      <small className="text-muted">
                                        {primerDeposito?.name ? (
                                          <>
                                            <i className="fas fa-file me-1"></i>
                                            {primerDeposito.name}
                                            {touchedFields.primerDepositoChanged && (
                                              <span className="text-warning ms-1">(Modificado)</span>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            <i className="fas fa-cloud me-1"></i>
                                            Archivo existente
                                          </>
                                        )}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Campo: Segundo Depósito (Imagen) */}
                          {mostrarSegundoDeposito && (
                            <div className="col-12 mb-3">
                              <label htmlFor="segundoDeposito" className="form-label">
                                Segundo Depósito (Imagen)
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="segundoDeposito"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, 'segundo')}
                                disabled={isFormDisabled}
                              />
                              {/* Preview de la imagen del segundo depósito */}
                              {segundoDepositoPreview && (
                                <div className="mt-3">
                                  <div className="d-flex align-items-start gap-2">
                                    <div className="position-relative">
                                      <img
                                        src={segundoDepositoPreview}
                                        alt="Preview Segundo Depósito"
                                        className="img-thumbnail"
                                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                                      />
                                      {/* Indicador de cambio */}
                                      {touchedFields.segundoDepositoChanged && (
                                        <span 
                                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning"
                                          title="Archivo modificado"
                                        >
                                          <i className="fas fa-edit"></i>
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex-grow-1">
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveFile('segundo')}
                                        disabled={isFormDisabled}
                                      >
                                        <i className="fas fa-times me-1"></i>
                                        Eliminar
                                      </button>
                                      <div className="mt-1">
                                        <small className="text-muted">
                                          {segundoDeposito?.name ? (
                                            <>
                                              <i className="fas fa-file me-1"></i>
                                              {segundoDeposito.name}
                                              {touchedFields.segundoDepositoChanged && (
                                                <span className="text-warning ms-1">(Modificado)</span>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              <i className="fas fa-cloud me-1"></i>
                                              Archivo existente
                                            </>
                                          )}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ===== SECCIÓN 3.2: CAMPOS CON VALORES POR DEFECTO ===== */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="text-success mb-3">
                          <i className="fas fa-check-circle me-2"></i>
                          Configuración Preestablecida
                        </h5>
                        <div className="alert alert-success">
                          <i className="fas fa-info-circle me-2"></i>
                          Los siguientes campos ya tienen valores configurados por defecto
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      {/* ===== COLUMNA IZQUIERDA ===== */}
                      <div className="col-12 col-lg-6">
                        <div className="row">
                                                     {/* Campo: Correo del Cliente */}
                           <div className="col-12 mb-3">
                             <label htmlFor="emailCliente" className="form-label">
                               Correo del Cliente <span className="text-success">✓</span>
                             </label>
                             <input
                               type="email"
                               className="form-control"
                               id="emailCliente"
                               name="emailCliente"
                               value={formData.emailCliente}
                               onChange={handleInputChange}
                             />
                             <div className="form-text text-success">
                               <i className="fas fa-check me-1"></i>
                               Correo configurado por defecto (puede ser editado)
                             </div>
                           </div>
                           
                           {/* Campo: Teléfono del Cliente */}
                           <div className="col-12 mb-3">
                             <label htmlFor="telefono" className="form-label">
                               Teléfono del Cliente <span className="text-success">✓</span>
                             </label>
                             <input
                               type="tel"
                               className="form-control"
                               id="telefono"
                               name="telefono"
                               value={formData.telefono}
                               onChange={handleInputChange}
                               placeholder="00"
                             />
                             <div className="form-text text-success">
                               <i className="fas fa-check me-1"></i>
                               Teléfono configurado por defecto como "00" (puede ser editado)
                             </div>
                           </div>
                          
                          {/* Campo: Nacionalidad */}
                          <div className="col-12 mb-3">
                            <label htmlFor="nacionalidad" className="form-label">
                              Nacionalidad <span className="text-success">✓</span>
                            </label>
                            <select
                              className="form-select"
                              id="nacionalidad"
                              name="nacionalidad"
                              value={formData.nacionalidad}
                              onChange={handleInputChange}
                            >
                              {nacionalidades.map(nacionalidad => (
                                <option 
                                  key={nacionalidad} 
                                  value={nacionalidad}
                                >
                                  {nacionalidad}
                                </option>
                              ))}
                            </select>
                            <div className="form-text text-success">
                              <i className="fas fa-check me-1"></i>
                              Costa Rica seleccionado por defecto
                            </div>
                          </div>
                          
                          {/* Campo: Mascotas */}
                          <div className="col-12 mb-3">
                            <label htmlFor="mascotas" className="form-label">
                              Mascotas <span className="text-success">✓</span>
                            </label>
                            <select
                              className="form-select"
                              id="mascotas"
                              name="mascotas"
                              value={formData.mascotas}
                              onChange={handleInputChange}
                            >
                              {opcionesMascotas.map(opcion => (
                                <option 
                                  key={opcion} 
                                  value={opcion}
                                >
                                  {opcion === "No" ? "No Mascotas" : `${opcion} Mascota${opcion > 1 ? 's' : ''}`}
                                </option>
                              ))}
                            </select>
                            <div className="form-text text-success">
                              <i className="fas fa-check me-1"></i>
                              Sin mascotas configurado por defecto
                            </div>
                          </div>
                          
                          {/* Campo: Depósito */}
                          <div className="col-12 mb-3">
                            <label htmlFor="deposito" className="form-label">
                              Depósito <span className="text-success">✓</span>
                            </label>
                            <select
                              className="form-select"
                              id="deposito"
                              name="deposito"
                              value={formData.deposito}
                              onChange={handleInputChange}
                            >
                              {opcionesDeposito.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
                            <div className="form-text text-success">
                              <i className="fas fa-check me-1"></i>
                              100% configurado por defecto
                            </div>
                          </div>
                          
                          {/* Campo: Moneda */}
                          <div className="col-12 mb-3">
                            <label htmlFor="moneda" className="form-label">
                              Moneda <span className="text-success">✓</span>
                            </label>
                            <select
                              className="form-select"
                              id="moneda"
                              name="moneda"
                              value={formData.moneda}
                              onChange={handleInputChange}
                            >
                              {opcionesMoneda.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
                            <div className="form-text text-success">
                              <i className="fas fa-check me-1"></i>
                              Colones configurado por defecto
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ===== COLUMNA DERECHA ===== */}
                      <div className="col-12 col-lg-6">
                        <div className="row">
                          {/* Campo: Tipo de Pago Primer Depósito */}
                          <div className="col-12 mb-3">
                            <label htmlFor="tipoPagoPrimerDeposito" className="form-label">
                              Tipo de Pago Primer Depósito <span className="text-success">✓</span>
                            </label>
                            <select
                              className="form-select"
                              id="tipoPagoPrimerDeposito"
                              name="tipoPagoPrimerDeposito"
                              value={formData.tipoPagoPrimerDeposito}
                              onChange={handleInputChange}
                            >
                              {opcionesTipoPago.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion || "Seleccione el tipo de depósito"}
                                </option>
                              ))}
                            </select>
                            <div className="form-text text-success">
                              <i className="fas fa-check me-1"></i>
                              Sinpe móvil configurado por defecto
                            </div>
                          </div>
                          
                          {/* Campo: Tipo de Pago Segundo Depósito */}
                          {mostrarSegundoDeposito && (
                            <div className="col-12 mb-3">
                              <label htmlFor="tipoPagoSegundoDeposito" className="form-label">
                                Tipo de Pago Segundo Depósito
                              </label>
                              <select
                                className="form-select"
                                id="tipoPagoSegundoDeposito"
                                name="tipoPagoSegundoDeposito"
                                value={formData.tipoPagoSegundoDeposito}
                                onChange={handleInputChange}
                              >
                                {opcionesTipoPago.map(opcion => (
                                  <option key={opcion} value={opcion}>
                                    {opcion || "Seleccione el tipo de depósito"}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ===== SECCIÓN 4: BOTONES DE ACCIÓN (PARTE INFERIOR) ===== */}
                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="d-flex flex-column flex-sm-row gap-2">
                          {/* Botón Actualizar - Solo visible si no está confirmado */}
                          {reservaData?.estado !== 'confirmado' && (
                            <button type="submit" className="btn btn-primary">
                              <i className="fas fa-save"></i> 
                              <span className="ms-1">Actualizar Reserva</span>
                            </button>
                          )}
                          
                          {/* Botón Volver - Siempre visible */}
                          <Link to="/reservas/listar" className="btn btn-secondary">
                            <i className="fas fa-arrow-left"></i> 
                            <span className="ms-1">Volver a Lista</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
