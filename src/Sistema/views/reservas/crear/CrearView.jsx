import React from "react";
import { Link } from "react-router-dom";
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
  opcionesExtras 
} from "../utils/ReservaUtils";

/**
 * ========================================
 * COMPONENTE: CrearView
 * ========================================
 * Componente para crear nuevas reservas. Renderiza un formulario completo
 * que permite al usuario ingresar todos los datos necesarios para una
 * nueva reserva de cabaña.
 * 
 * CARACTERÍSTICAS:
 * - Formulario responsivo (mobile, tablet, desktop)
 * - Validación de campos obligatorios
 * - Carga de imágenes con preview
 * - Selección múltiple de extras usando Material-UI
 * - Campos condicionales (se muestran solo después de seleccionar cabaña y tipo de reserva)
 * 
 * @returns {JSX.Element} Formulario de creación de reserva
 */
export const CrearView = () => {
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
    handleCabañaChange,
    handleInputChange,
    handleExtrasChange,
    handleFileChange,
    handleRemoveFile,
    handleSubmit
  } = useReservaForm();

  // ===== MANEJADOR DE ENVÍO =====
  /**
   * Maneja el envío del formulario para crear una nueva reserva
   * @param {Event} e - Evento del formulario
   */
  const onSubmit = (e) => {
    handleSubmit(e, false); // false = crear nueva reserva
  };

  // ===== CONDICIÓN DE VISUALIZACIÓN =====
  // Los campos adicionales solo se muestran después de seleccionar cabaña y tipo de reserva
  const ambosSeleccionados = cabañaSeleccionada && formData.tipoReserva;

  return (
    <div className="container-fluid px-3 px-md-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            {/* ===== HEADER DEL CARD ===== */}
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h4 className="card-title mb-0">Crear Nueva Reserva</h4>
              <Link to="/reservas/lista" className="btn btn-secondary btn-sm">
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
                      className="form-select"
                      id="cabañaId"
                      value={cabañaSeleccionada}
                      onChange={handleCabañaChange}
                      required
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
                      className="form-select"
                      id="tipoReserva"
                      name="tipoReserva"
                      value={formData.tipoReserva}
                      onChange={handleInputChange}
                      required
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

                {/* ===== SECCIÓN 3: CAMPOS ADICIONALES (CONDICIONALES) ===== */}
                {/* Campos adicionales que aparecen después de seleccionar cabaña y tipo de reserva */}
                {ambosSeleccionados && (
                  <>
                    {/* Formulario en 2 columnas */}
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
                              className="form-control"
                              id="nombreCliente"
                              name="nombreCliente"
                              value={formData.nombreCliente}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Correo del Cliente */}
                          <div className="col-12 mb-3">
                            <label htmlFor="emailCliente" className="form-label">
                              Correo del Cliente <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="emailCliente"
                              name="emailCliente"
                              value={formData.emailCliente}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Cantidad de Personas */}
                          <div className="col-12 mb-3">
                            <label htmlFor="cantidadPersonas" className="form-label">
                              Cantidad de Personas <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="cantidadPersonas"
                              name="cantidadPersonas"
                              min="1"
                              value={formData.cantidadPersonas}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Depósito */}
                          <div className="col-12 mb-3">
                            <label htmlFor="deposito" className="form-label">
                              Depósito <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="deposito"
                              name="deposito"
                              value={formData.deposito}
                              onChange={handleInputChange}
                              required
                            >
                              {opcionesDeposito.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Campo: Moneda */}
                          <div className="col-12 mb-3">
                            <label htmlFor="moneda" className="form-label">
                              Moneda <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="moneda"
                              name="moneda"
                              value={formData.moneda}
                              onChange={handleInputChange}
                              required
                            >
                              {opcionesMoneda.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Campo: Total Depositado */}
                          <div className="col-12 mb-3">
                            <label htmlFor="totalDepositado" className="form-label">
                              Total Depositado <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="totalDepositado"
                              name="totalDepositado"
                              min="0"
                              step="0.01"
                              value={formData.totalDepositado}
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
                              className="form-control"
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
                              className="form-control"
                              id="horaSalida"
                              name="horaSalida"
                              value={formData.horaSalida}
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
                              className="form-control"
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
                              className="form-control"
                              id="fechaSalida"
                              name="fechaSalida"
                              value={formData.fechaSalida}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          {/* Campo: Tipo de Pago Primer Depósito */}
                          <div className="col-12 mb-3">
                            <label htmlFor="tipoPagoPrimerDeposito" className="form-label">
                              Tipo de Pago Primer Depósito <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="tipoPagoPrimerDeposito"
                              name="tipoPagoPrimerDeposito"
                              value={formData.tipoPagoPrimerDeposito}
                              onChange={handleInputChange}
                              required
                            >
                              {opcionesTipoPago.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
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
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'primer')}
                            />
                            {/* Preview de la imagen del primer depósito */}
                            {primerDepositoPreview && (
                              <div className="mt-3">
                                <div className="d-flex align-items-start gap-2">
                                  <img
                                    src={primerDepositoPreview}
                                    alt="Preview Primer Depósito"
                                    className="img-thumbnail"
                                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                                  />
                                  <div className="flex-grow-1">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRemoveFile('primer')}
                                    >
                                      <i className="fas fa-times me-1"></i>
                                      Eliminar
                                    </button>
                                    <div className="mt-1">
                                      <small className="text-muted">
                                        Archivo: {primerDeposito?.name}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Campo: Tipo de Pago Segundo Depósito */}
                          <div className="col-12 mb-3">
                            <label htmlFor="tipoPagoSegundoDeposito" className="form-label">
                              Tipo de Pago Segundo Depósito <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="tipoPagoSegundoDeposito"
                              name="tipoPagoSegundoDeposito"
                              value={formData.tipoPagoSegundoDeposito}
                              onChange={handleInputChange}
                              required
                            >
                              {opcionesTipoPago.map(opcion => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Campo: Segundo Depósito (Imagen) */}
                          <div className="col-12 mb-3">
                            <label htmlFor="segundoDeposito" className="form-label">
                              Segundo Depósito (Imagen)
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="segundoDeposito"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'segundo')}
                            />
                            {/* Preview de la imagen del segundo depósito */}
                            {segundoDepositoPreview && (
                              <div className="mt-3">
                                <div className="d-flex align-items-start gap-2">
                                  <img
                                    src={segundoDepositoPreview}
                                    alt="Preview Segundo Depósito"
                                    className="img-thumbnail"
                                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                                  />
                                  <div className="flex-grow-1">
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRemoveFile('segundo')}
                                    >
                                      <i className="fas fa-times me-1"></i>
                                      Eliminar
                                    </button>
                                    <div className="mt-1">
                                      <small className="text-muted">
                                        Archivo: {segundoDeposito?.name}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ===== SECCIÓN 4: BOTONES DE ACCIÓN ===== */}
                    {/* Botones de acción */}
                    <div className="row mt-4">
                      <div className="col-12 d-flex flex-column flex-sm-row gap-2">
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-save"></i> 
                          <span className="ms-1">Crear Reserva</span>
                        </button>
                        <Link to="/reservas/lista" className="btn btn-secondary">
                          <i className="fas fa-times"></i> 
                          <span className="ms-1">Cancelar</span>
                        </Link>
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
