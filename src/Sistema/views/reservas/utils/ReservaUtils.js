import { useState } from "react";
import { getCabañasColores } from "../../../../hooks/CabanasDisponibles";

/**
 * ========================================
 * CONSTANTES Y OPCIONES PARA LOS SELECTS
 * ========================================
 * Estas constantes definen las opciones disponibles para los diferentes
 * campos de selección en el formulario de reservas.
 */

// Opciones para el campo de depósito (porcentaje)
export const opcionesDeposito = ["50%", "100%"];

// Opciones para el campo de moneda
export const opcionesMoneda = ["Colones", "Dólares"];

// Opciones para los tipos de pago (incluye opción vacía)
export const opcionesTipoPago = ["", "Sinpe móvil", "Depósito"];

// Opciones para el tipo de reserva (orden específico solicitado)
export const opcionesTipoReserva = ["Reserva Local", "Airbnb", "Booking"];

// Opciones para los extras/servicios adicionales
export const opcionesExtras = [
  "WiFi",
  "Aire acondicionado", 
  "Cocina equipada",
  "Estacionamiento",
  "Servicio de limpieza",
  "Desayuno incluido",
  "Parrilla",
  "Jacuzzi"
];

/**
 * ========================================
 * FUNCIÓN PARA OBTENER ESTADO INICIAL
 * ========================================
 * Crea el estado inicial del formulario, ya sea para una nueva reserva
 * o para editar una reserva existente.
 * 
 * @param {Object|null} reservaData - Datos de una reserva existente (opcional)
 * @returns {Object} Estado inicial del formulario con valores por defecto
 */
export const getInitialFormState = (reservaData = null) => ({
  // Información del cliente
  nombreCliente: reservaData?.nombreCliente || "",
  emailCliente: reservaData?.emailCliente || "",
  
  // Detalles de la reserva
  cantidadPersonas: reservaData?.cantidadPersonas || 1,
  deposito: reservaData?.deposito || "50%",
  moneda: reservaData?.moneda || "Colones",
  totalDepositado: reservaData?.totalDepositado || "",
  
  // Horarios
  horaIngreso: reservaData?.horaIngreso || "15:00", // 3 PM por defecto
  horaSalida: reservaData?.horaSalida || "11:00",   // 11 AM por defecto
  
  // Fechas
  fechaIngreso: reservaData?.fechaIngreso || "",
  fechaSalida: reservaData?.fechaSalida || "",
  
  // Tipos de pago para depósitos (vacíos por defecto)
  tipoPagoPrimerDeposito: reservaData?.tipoPagoPrimerDeposito || "",
  tipoPagoSegundoDeposito: reservaData?.tipoPagoSegundoDeposito || "",
  
  // Tipo de reserva
  tipoReserva: reservaData?.tipoReserva || "Reserva Local",
  
  // Extras seleccionados (array)
  extras: reservaData?.extras || []
});

/**
 * ========================================
 * HOOK PERSONALIZADO PARA EL FORMULARIO
 * ========================================
 * Hook que encapsula toda la lógica del formulario de reservas,
 * incluyendo estado, validaciones y manejo de archivos.
 * 
 * @param {Object|null} reservaData - Datos de reserva existente para edición
 * @returns {Object} Objeto con estados y funciones del formulario
 */
export const useReservaForm = (reservaData = null) => {
  // ===== ESTADOS PRINCIPALES =====
  
  // Estado de la cabaña seleccionada
  const [cabañaSeleccionada, setCabañaSeleccionada] = useState(reservaData?.cabañaId || "");
  
  // Estado del formulario con todos los campos
  const [formData, setFormData] = useState(getInitialFormState(reservaData));
  
  // ===== ESTADOS PARA ARCHIVOS Y PREVIEWS =====
  
  // Archivos seleccionados
  const [primerDeposito, setPrimerDeposito] = useState(null);
  const [segundoDeposito, setSegundoDeposito] = useState(null);
  
  // URLs de preview de las imágenes
  const [primerDepositoPreview, setPrimerDepositoPreview] = useState(reservaData?.primerDepositoPreview || null);
  const [segundoDepositoPreview, setSegundoDepositoPreview] = useState(reservaData?.segundoDepositoPreview || null);

  // Obtener lista de cabañas disponibles
  const cabañas = getCabañasColores();

  // ===== MANEJADORES DE EVENTOS =====

  /**
   * Maneja el cambio de selección de cabaña
   * @param {Event} e - Evento del select
   */
  const handleCabañaChange = (e) => {
    const cabañaId = e.target.value;
    setCabañaSeleccionada(cabañaId);
  };

  /**
   * Maneja los cambios en los campos de texto, número, select, etc.
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja los cambios en el campo de extras (selección múltiple)
   * @param {Event} event - Evento del select múltiple de Material-UI
   */
  const handleExtrasChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      extras: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  /**
   * Maneja la carga de archivos de imagen con preview
   * @param {Event} e - Evento del input file
   * @param {string} tipo - Tipo de depósito ('primer' o 'segundo')
   */
  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen');
        return;
      }

      // Crear preview usando FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        if (tipo === 'primer') {
          setPrimerDeposito(file);
          setPrimerDepositoPreview(e.target.result);
        } else {
          setSegundoDeposito(file);
          setSegundoDepositoPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Elimina un archivo y su preview
   * @param {string} tipo - Tipo de depósito ('primer' o 'segundo')
   */
  const handleRemoveFile = (tipo) => {
    if (tipo === 'primer') {
      setPrimerDeposito(null);
      setPrimerDepositoPreview(null);
      // Limpiar el tipo de pago cuando se elimina la imagen
      setFormData(prev => ({
        ...prev,
        tipoPagoPrimerDeposito: ""
      }));
    } else {
      setSegundoDeposito(null);
      setSegundoDepositoPreview(null);
      // Limpiar el tipo de pago cuando se elimina la imagen
      setFormData(prev => ({
        ...prev,
        tipoPagoSegundoDeposito: ""
      }));
    }
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   * @param {boolean} isEdit - Indica si es edición (true) o creación (false)
   * @returns {FormData} Datos del formulario listos para enviar al servidor
   */
  const handleSubmit = (e, isEdit = false) => {
    e.preventDefault();
    
    // Crear FormData con todos los datos
    const submitFormData = new FormData();
    
    // ===== DATOS DE LA CABAÑA =====
    submitFormData.append('cabañaId', cabañaSeleccionada);
    
    // Buscar información adicional de la cabaña
    const cabaña = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));
    if (cabaña) {
      submitFormData.append('cabañaNombre', cabaña.nombre);
      submitFormData.append('cabañaColor', cabaña.color);
    }
    
    // ===== DATOS DEL FORMULARIO =====
    Object.keys(formData).forEach(key => {
      if (key === 'extras') {
        // Los extras se envían como JSON string
        submitFormData.append('extras', JSON.stringify(formData[key]));
      } else {
        submitFormData.append(key, formData[key]);
      }
    });

    // ===== ARCHIVOS =====
    if (primerDeposito) {
      submitFormData.append('primerDeposito', primerDeposito);
    }
    if (segundoDeposito) {
      submitFormData.append('segundoDeposito', segundoDeposito);
    }

    // ===== FLAG PARA EDICIÓN =====
    if (isEdit) {
      submitFormData.append('isEdit', 'true');
    }
    
    // ===== LOGGING PARA DEBUGGING =====
    console.log('FormData creado:', submitFormData);
    
    // Mostrar los datos en consola para verificación
    for (let [key, value] of submitFormData.entries()) {
      console.log(`${key}: ${value}`);
    }

    return submitFormData;
  };

  // ===== DATOS DERIVADOS =====
  
  // Obtener la cabaña seleccionada para mostrar en el alert
  const cabañaActual = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));

  // ===== RETORNO DEL HOOK =====
  return {
    // Estados
    cabañaSeleccionada,
    formData,
    primerDeposito,
    segundoDeposito,
    primerDepositoPreview,
    segundoDepositoPreview,
    cabañas,
    cabañaActual,
    
    // Funciones
    handleCabañaChange,
    handleInputChange,
    handleExtrasChange,
    handleFileChange,
    handleRemoveFile,
    handleSubmit
  };
};

/**
 * ========================================
 * FUNCIÓN DE VALIDACIÓN DEL FORMULARIO
 * ========================================
 * Valida todos los campos del formulario y retorna un array
 * con los errores encontrados.
 * 
 * @param {Object} formData - Datos del formulario
 * @param {string} cabañaSeleccionada - ID de la cabaña seleccionada
 * @param {File|null} primerDeposito - Archivo del primer depósito
 * @param {File|null} segundoDeposito - Archivo del segundo depósito
 * @returns {Array} Array de mensajes de error (vacío si no hay errores)
 */
export const validateForm = (formData, cabañaSeleccionada, primerDeposito = null, segundoDeposito = null) => {
  const errors = [];

  // ===== VALIDACIONES OBLIGATORIAS =====
  
  // Validar selección de cabaña
  if (!cabañaSeleccionada) {
    errors.push("Debe seleccionar una cabaña");
  }

  // Validar nombre del cliente
  if (!formData.nombreCliente.trim()) {
    errors.push("El nombre del cliente es requerido");
  }

  // Validar email del cliente
  if (!formData.emailCliente.trim()) {
    errors.push("El correo del cliente es requerido");
  } else {
    // Validar formato de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailCliente)) {
      errors.push("El formato del correo electrónico no es válido");
    }
  }

  // ===== VALIDACIONES NUMÉRICAS =====
  
  // Validar cantidad de personas
  if (!formData.cantidadPersonas || formData.cantidadPersonas < 1) {
    errors.push("La cantidad de personas debe ser al menos 1");
  }

  // Validar total depositado
  if (!formData.totalDepositado || parseFloat(formData.totalDepositado) <= 0) {
    errors.push("El total depositado debe ser mayor a 0");
  }

  // ===== VALIDACIONES DE FECHAS =====
  
  // Validar fecha de ingreso
  if (!formData.fechaIngreso) {
    errors.push("La fecha de ingreso es requerida");
  }

  // Validar fecha de salida
  if (!formData.fechaSalida) {
    errors.push("La fecha de salida es requerida");
  }

  // Validar que la fecha de salida sea posterior a la de ingreso
  if (formData.fechaIngreso && formData.fechaSalida) {
    const fechaIngreso = new Date(formData.fechaIngreso);
    const fechaSalida = new Date(formData.fechaSalida);
    
    if (fechaIngreso >= fechaSalida) {
      errors.push("La fecha de salida debe ser posterior a la fecha de ingreso");
    }
  }

  // ===== VALIDACIONES DE TIPOS DE PAGO (CONDICIONALES) =====
  
  // Validar tipo de pago primer depósito solo si hay imagen
  if (primerDeposito && !formData.tipoPagoPrimerDeposito) {
    errors.push("El tipo de pago del primer depósito es requerido cuando hay una imagen seleccionada");
  }

  // Validar tipo de pago segundo depósito solo si hay imagen
  if (segundoDeposito && !formData.tipoPagoSegundoDeposito) {
    errors.push("El tipo de pago del segundo depósito es requerido cuando hay una imagen seleccionada");
  }

  // ===== VALIDACIONES ADICIONALES =====
  
  // Validar tipo de reserva
  if (!formData.tipoReserva) {
    errors.push("El tipo de reserva es requerido");
  }

  return errors;
};

/**
 * ========================================
 * FUNCIÓN PARA FORMATEAR DATOS
 * ========================================
 * Formatea los datos de una reserva para mostrarlos en el formulario
 * de edición, convirtiendo fechas y arrays según sea necesario.
 * 
 * @param {Object} reserva - Datos de la reserva
 * @returns {Object} Datos formateados para el formulario
 */
export const formatReservaData = (reserva) => {
  return {
    ...reserva,
    // Convertir fechas a formato YYYY-MM-DD para inputs de tipo date
    fechaIngreso: reserva.fechaIngreso ? new Date(reserva.fechaIngreso).toISOString().split('T')[0] : '',
    fechaSalida: reserva.fechaSalida ? new Date(reserva.fechaSalida).toISOString().split('T')[0] : '',
    // Asegurar que extras sea un array
    extras: Array.isArray(reserva.extras) ? reserva.extras : JSON.parse(reserva.extras || '[]')
  };
};
