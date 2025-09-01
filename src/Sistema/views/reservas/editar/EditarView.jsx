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
  opcionesExtras,
  nacionalidades,
  opcionesMascotas,
  validateForm,
  getValidationClasses
} from "../utils/ReservaUtils";

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
 * 
 * @returns {JSX.Element} Formulario de edición de reserva
 */
export const EditarView = () => {
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
  } = useReservaForm();

  // ===== MANEJADOR DE ENVÍO =====
  /**
   * Maneja el envío del formulario para actualizar una reserva existente
   * @param {Event} e - Evento del formulario
   */
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validar el formulario con los archivos
    const errors = validateForm(formData, cabañaSeleccionada, primerDeposito, segundoDeposito);
    if (errors.length > 0) {
      alert("Por favor, corrija los siguientes errores:\n" + errors.join("\n"));
      return;
    }
    
    handleSubmit(e, true); // true = editar reserva existente
  };

  // ===== CONDICIÓN DE VISUALIZACIÓN =====
  // Los campos adicionales solo se muestran después de seleccionar cabaña y tipo de reserva
  const ambosSeleccionados = cabañaSeleccionada && formData.tipoReserva;
  
  // Condición para mostrar campos del segundo depósito (solo si depósito es 50%)
  const mostrarSegundoDeposito = formData.deposito === "50%";

  return (
    <div className="container-fluid px-3 px-md-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            {/* ===== HEADER DEL CARD ===== */}
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h4 className="card-title mb-0">Editar Reserva</h4>
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
                      className={getValidationClasses("cabañaId", formData, touchedFields, cabañaSeleccionada)}
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
                      className={getValidationClasses("tipoReserva", formData, touchedFields)}
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
                {ambosSeleccionados && (
                  <>
                    {/* ===== SECCIÓN 3.1: CAMPOS QUE EL USUARIO DEBE LLENAR ===== */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="text-primary mb-3">
                          <i className="fas fa-edit me-2"></i>
                          Información Requerida
                        </h5>
                        <div className="alert alert-info">
                          <i className="fas fa-info-circle me-2"></i>
                          Complete los siguientes campos para actualizar la reserva
                        </div>
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
                              Correo configurado por defecto
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
                                  selected={nacionalidad === "Costa Rica"}
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
                                  selected={opcion === "No"}
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

                    {/* ===== SECCIÓN 4: BOTONES DE ACCIÓN ===== */}
                    {/* Botones de acción */}
                    <div className="row mt-4">
                      <div className="col-12 d-flex flex-column flex-sm-row gap-2">
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-save"></i> 
                          <span className="ms-1">Actualizar Reserva</span>
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
