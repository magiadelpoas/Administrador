import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getCabañasColores } from "../../../../hooks/CabanasDisponibles";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
  Box,
  OutlinedInput
} from '@mui/material';

export const CrearView = () => {
  const [cabañaSeleccionada, setCabañaSeleccionada] = useState("");
  const [formData, setFormData] = useState({
    nombreCliente: "",
    cantidadPersonas: 1,
    deposito: "50%",
    moneda: "Colones",
    totalDepositado: "",
    horaIngreso: "15:00",
    horaSalida: "11:00",
    fechaIngreso: "",
    fechaSalida: "",
    extras: []
  });

  const cabañas = getCabañasColores();

  // Opciones para los selects
  const opcionesDeposito = ["50%", "100%"];
  const opcionesMoneda = ["Colones", "Dólares"];
  const opcionesExtras = [
    "WiFi",
    "Aire acondicionado", 
    "Cocina equipada",
    "Estacionamiento",
    "Servicio de limpieza",
    "Desayuno incluido",
    "Parrilla",
    "Jacuzzi"
  ];

  const handleCabañaChange = (e) => {
    const cabañaId = e.target.value;
    setCabañaSeleccionada(cabañaId);
    
    // Crear FormData
    const newFormData = new FormData();
    newFormData.append('cabañaId', cabañaId);
    
    // Obtener información adicional de la cabaña seleccionada
    const cabaña = cabañas.find(c => c.id === parseInt(cabañaId));
    if (cabaña) {
      newFormData.append('cabañaNombre', cabaña.nombre);
      newFormData.append('cabañaColor', cabaña.color);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExtrasChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      extras: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear FormData con todos los datos
    const submitFormData = new FormData();
    
    // Datos de la cabaña
    submitFormData.append('cabañaId', cabañaSeleccionada);
    const cabaña = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));
    if (cabaña) {
      submitFormData.append('cabañaNombre', cabaña.nombre);
      submitFormData.append('cabañaColor', cabaña.color);
    }
    
    // Datos del formulario
    Object.keys(formData).forEach(key => {
      if (key === 'extras') {
        submitFormData.append('extras', JSON.stringify(formData[key]));
      } else {
        submitFormData.append(key, formData[key]);
      }
    });
    
    // Aquí puedes enviar el FormData al servidor
    console.log('FormData creado:', submitFormData);
    
    // Mostrar los datos en consola para verificación
    for (let [key, value] of submitFormData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  // Obtener la cabaña seleccionada para mostrar en el alert
  const cabañaActual = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));

  return (
    <div className="container-fluid px-3 px-md-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h4 className="card-title mb-0">Crear Nueva Reserva</h4>
              <Link to="/reservas/lista" className="btn btn-secondary btn-sm">
                <i className="fas fa-arrow-left"></i> 
                <span className="d-none d-sm-inline ms-1">Volver a Lista</span>
                <span className="d-sm-none">Volver</span>
              </Link>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 col-md-6">
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
                  <div className="row mt-3">
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
                    <div className="row mt-4">
                      <div className="col-12 col-md-6 mb-3">
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
                      <div className="col-12 col-md-6 mb-3">
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
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 mb-3">
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
                      <div className="col-12 col-md-4 mb-3">
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
                      <div className="col-12 col-md-4 mb-3">
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

                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-3 mb-3">
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
                      <div className="col-12 col-sm-6 col-md-3 mb-3">
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
                      <div className="col-12 col-sm-6 col-md-3 mb-3">
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
                      <div className="col-12 col-sm-6 col-md-3 mb-3">
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
