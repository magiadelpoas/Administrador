

import React, { useEffect, useState } from "react";
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
  opcionesExtras,
  formatReservaData
} from "../utils/ReservaUtils";

export const EditarView = () => {
  const { id } = useParams();
  const [reservaData, setReservaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos de la reserva (aquí deberías hacer una llamada a tu API)
  useEffect(() => {
    // Simular datos de una reserva existente
    const mockReservaData = {
      id: id,
      cabañaId: "1",
      nombreCliente: "Juan Pérez",
      cantidadPersonas: 4,
      deposito: "50%",
      moneda: "Colones",
      totalDepositado: "150000",
      horaIngreso: "15:00",
      horaSalida: "11:00",
      fechaIngreso: "2024-02-15",
      fechaSalida: "2024-02-18",
      extras: ["WiFi", "Aire acondicionado", "Cocina equipada"],
      primerDepositoPreview: null, // URL de la imagen existente
      segundoDepositoPreview: null // URL de la imagen existente
    };

    // Simular delay de carga
    setTimeout(() => {
      setReservaData(formatReservaData(mockReservaData));
      setLoading(false);
    }, 500);
  }, [id]);

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
  } = useReservaForm(reservaData);

  const onSubmit = (e) => {
    handleSubmit(e, true); // true = editar reserva existente
  };

  if (loading) {
    return (
      <div className="container-fluid px-3 px-md-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos de la reserva...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h4 className="card-title mb-0">Editar Reserva #{id}</h4>
              <Link to="/reservas/lista" className="btn btn-secondary btn-sm">
                <i className="fas fa-arrow-left"></i> 
                <span className="d-none d-sm-inline ms-1">Volver a Lista</span>
                <span className="d-sm-none">Volver</span>
              </Link>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* Selección de Cabaña - Ancho completo */}
                <div className="row mb-4">
                  <div className="col-12">
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
                </div>

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

                {/* Campos adicionales que aparecen después de seleccionar cabaña */}
                {cabañaSeleccionada && (
                  <>
                    {/* Formulario en 2 columnas */}
                    <div className="row">
                      {/* COLUMNA IZQUIERDA */}
                      <div className="col-12 col-lg-6">
                        <div className="row">
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
                        </div>
                      </div>

                      {/* COLUMNA DERECHA */}
                      <div className="col-12 col-lg-6">
                        <div className="row">
                          <div className="col-12 col-sm-6 mb-3">
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
                          <div className="col-12 col-sm-6 mb-3">
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
                          <div className="col-12 col-sm-6 mb-3">
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
                          <div className="col-12 col-sm-6 mb-3">
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
                        </div>
                      </div>
                    </div>

                    {/* Extras - Ancho completo */}
                    <div className="row mt-3">
                      <div className="col-12">
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

                    {/* Campos de archivos para depósitos */}
                    <div className="row mt-4">
                      <div className="col-12 col-md-6 mb-3">
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
                                    Archivo: {primerDeposito?.name || "Imagen existente"}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-6 mb-3">
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
                                    Archivo: {segundoDeposito?.name || "Imagen existente"}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

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
