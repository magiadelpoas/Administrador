import { useState, useEffect } from "react";
import { getCabañasColores, getCapacidadMaxima } from "../../../../hooks/CabanasDisponibles";
import { swalHelpers } from "../../../../utils/sweetalertConfig";

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
export const opcionesTipoReserva = ["WhatsApp", "Airbnb", "Booking"];

// Opciones para los extras/servicios adicionales
export const opcionesExtras = [
  "Tabla de fiambres",
  "Tabla de fresas", 
  "Tabla de fiambres + vino",
  "Vino",
  "Decoración pétalos",
  "Globos",
  "Propuesta de matrimonio/ noviazgo"
];

// Lista completa de nacionalidades
export const nacionalidades = [
  "No especifica",
  "Afganistán",
  "Albania",
  "Alemania",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antártida",
  "Antigua y Barbuda",
  "Antillas Holandesas",
  "Arabia Saudí",
  "Argelia",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaiyán",
  "Bahamas",
  "Bahrein",
  "Bangladesh",
  "Barbados",
  "Bélgica",
  "Belice",
  "Benin",
  "Bermudas",
  "Bielorrusia",
  "Birmania",
  "Bolivia",
  "Bosnia y Herzegovina",
  "Botswana",
  "Brasil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Bután",
  "Cabo Verde",
  "Camboya",
  "Camerún",
  "Canadá",
  "Chad",
  "Chile",
  "China",
  "Chipre",
  "Ciudad del Vaticano (Santa Sede)",
  "Colombia",
  "Comores",
  "Congo",
  "Congo, República Democrática del",
  "Corea",
  "Corea del Norte",
  "Costa de Marfíl",
  "Costa Rica",
  "Croacia (Hrvatska)",
  "Cuba",
  "Dinamarca",
  "Djibouti",
  "Dominica",
  "Ecuador",
  "Egipto",
  "El Salvador",
  "Emiratos Árabes Unidos",
  "Eritrea",
  "Eslovenia",
  "España",
  "Estados Unidos",
  "Estonia",
  "Etiopía",
  "Fiji",
  "Filipinas",
  "Finlandia",
  "Francia",
  "Gabón",
  "Gambia",
  "Georgia",
  "Ghana",
  "Gibraltar",
  "Granada",
  "Grecia",
  "Groenlandia",
  "Guadalupe",
  "Guam",
  "Guatemala",
  "Guayana",
  "Guayana Francesa",
  "Guinea",
  "Guinea Ecuatorial",
  "Guinea-Bissau",
  "Haití",
  "Honduras",
  "Hungría",
  "India",
  "Indonesia",
  "Irak",
  "Irán",
  "Irlanda",
  "Isla Bouvet",
  "Isla de Christmas",
  "Islandia",
  "Islas Caimán",
  "Islas Cook",
  "Islas de Cocos o Keeling",
  "Islas Faroe",
  "Islas Heard y McDonald",
  "Islas Malvinas",
  "Islas Marianas del Norte",
  "Islas Marshall",
  "Islas menores de Estados Unidos",
  "Islas Palau",
  "Islas Salomón",
  "Islas Svalbard y Jan Mayen",
  "Islas Tokelau",
  "Islas Turks y Caicos",
  "Islas Vírgenes (EEUU)",
  "Islas Vírgenes (Reino Unido)",
  "Islas Wallis y Futuna",
  "Israel",
  "Italia",
  "Jamaica",
  "Japón",
  "Jordania",
  "Kazajistán",
  "Kenia",
  "Kirguizistán",
  "Kiribati",
  "Kuwait",
  "Laos",
  "Lesotho",
  "Letonia",
  "Líbano",
  "Liberia",
  "Libia",
  "Liechtenstein",
  "Lituania",
  "Luxemburgo",
  "Macedonia, Ex-República Yugoslava de",
  "Madagascar",
  "Malasia",
  "Malawi",
  "Maldivas",
  "Malí",
  "Malta",
  "Marruecos",
  "Martinica",
  "Mauricio",
  "Mauritania",
  "Mayotte",
  "México",
  "Micronesia",
  "Moldavia",
  "Mónaco",
  "Mongolia",
  "Montserrat",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Nicaragua",
  "Níger",
  "Nigeria",
  "Niue",
  "Norfolk",
  "Noruega",
  "Nueva Caledonia",
  "Nueva Zelanda",
  "Omán",
  "Países Bajos",
  "Panamá",
  "Papúa Nueva Guinea",
  "Paquistán",
  "Paraguay",
  "Perú",
  "Pitcairn",
  "Polinesia Francesa",
  "Polonia",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reino Unido",
  "República Centroafricana",
  "República Checa",
  "República de Sudáfrica",
  "República Dominicana",
  "República Eslovaca",
  "Reunión",
  "Ruanda",
  "Rumania",
  "Rusia",
  "Sahara Occidental",
  "Saint Kitts y Nevis",
  "Samoa",
  "Samoa Americana",
  "San Marino",
  "San Vicente y Granadinas",
  "Santa Helena",
  "Santa Lucía",
  "Santo Tomé y Príncipe",
  "Senegal",
  "Seychelles",
  "Sierra Leona",
  "Singapur",
  "Siria",
  "Somalia",
  "Sri Lanka",
  "St Pierre y Miquelon",
  "Suazilandia",
  "Sudán",
  "Suecia",
  "Suiza",
  "Surinam",
  "Tailandia",
  "Taiwán",
  "Tanzania",
  "Tayikistán",
  "Territorios franceses del Sur",
  "Timor Oriental",
  "Togo",
  "Tonga",
  "Trinidad y Tobago",
  "Túnez",
  "Turkmenistán",
  "Turquía",
  "Tuvalu",
  "Ucrania",
  "Uganda",
  "Uruguay",
  "Uzbekistán",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Yugoslavia",
  "Zambia",
  "Zimbabue"
];

// Opciones para mascotas
export const opcionesMascotas = [
  "No",
  "1",
  "2"
];

// Nota: getCapacidadMaxima ahora se importa desde CabanasDisponibles.js

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
  emailCliente: reservaData?.emailCliente || "info@magiadelpoas.com",
  telefono: reservaData?.telefono || "00",
  nacionalidad: reservaData?.nacionalidad || "Costa Rica",
  mascotas: reservaData?.mascotas || "No",
  
  // Detalles de la reserva
  cantidadPersonas: reservaData?.cantidadPersonas || 2,
  deposito: reservaData?.deposito || "100%",
  moneda: reservaData?.moneda || "Colones",
  totalDepositado: reservaData?.totalDepositado || "",
  
  // Horarios
  horaIngreso: reservaData?.horaIngreso || "15:00", // 3 PM por defecto
  horaSalida: reservaData?.horaSalida || "11:00",   // 11 AM por defecto
  
  // Fechas
  fechaIngreso: reservaData?.fechaIngreso || "",
  fechaSalida: reservaData?.fechaSalida || "",
  
  // Tipos de pago para depósitos (Sinpe móvil por defecto para primer depósito)
  tipoPagoPrimerDeposito: reservaData?.tipoPagoPrimerDeposito || "Sinpe móvil",
  tipoPagoSegundoDeposito: reservaData?.tipoPagoSegundoDeposito || "",
  
  // Tipo de reserva
  tipoReserva: reservaData?.tipoReserva || "WhatsApp",
  
  // Estado de la reserva
  estado: reservaData?.estado || "pendiente",
  
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
  
  // Estado para campos tocados (para validación visual)
  const [touchedFields, setTouchedFields] = useState({});
  
  // ===== ESTADOS PARA ARCHIVOS Y PREVIEWS =====
  
  // Archivos seleccionados
  const [primerDeposito, setPrimerDeposito] = useState(null);
  const [segundoDeposito, setSegundoDeposito] = useState(null);
  
  // URLs de preview de las imágenes
  const [primerDepositoPreview, setPrimerDepositoPreview] = useState(reservaData?.primerDepositoPreview || null);
  const [segundoDepositoPreview, setSegundoDepositoPreview] = useState(reservaData?.segundoDepositoPreview || null);

  // Obtener lista de cabañas disponibles
  const cabañas = getCabañasColores();

  // ===== EFECTO PARA ACTUALIZAR DATOS CUANDO CAMBIA reservaData =====
  useEffect(() => {
    if (reservaData) {
      setCabañaSeleccionada(reservaData.cabañaId || "");
      setFormData(getInitialFormState(reservaData));
      setPrimerDepositoPreview(reservaData.primerDepositoPreview || null);
      setSegundoDepositoPreview(reservaData.segundoDepositoPreview || null);
    }
  }, [reservaData]);

  // ===== MANEJADORES DE EVENTOS =====

  /**
   * Maneja el cambio de selección de cabaña
   * @param {Event} e - Evento del select
   */
  const handleCabañaChange = (e) => {
    const cabañaId = e.target.value;
    setCabañaSeleccionada(cabañaId);
    
    // Marcar el campo como tocado para validación visual
    setTouchedFields(prev => ({
      ...prev,
      cabañaId: true
    }));
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
    
    // Marcar el campo como tocado para validación visual
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  /**
   * Maneja el evento blur para validación visual inmediata
   * @param {Event} e - Evento del input
   */
  const handleInputBlur = (e) => {
    const { name } = e.target;
    
    // Si es llamado desde la validación del formulario, marcar todos los campos como tocados
    if (name === 'form-validation') {
      const allFields = [
        'cabañaId', 'tipoReserva', 'nombreCliente', 'emailCliente', 
        'cantidadPersonas', 'totalDepositado', 'fechaIngreso', 'fechaSalida',
        'horaIngreso', 'horaSalida'
      ];
      
      const newTouchedFields = {};
      allFields.forEach(field => {
        newTouchedFields[field] = true;
      });
      
      setTouchedFields(prev => ({
        ...prev,
        ...newTouchedFields
      }));
    } else {
      // Marcar solo el campo específico como tocado
      setTouchedFields(prev => ({
        ...prev,
        [name]: true
      }));
    }
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
    
    // Marcar el campo como tocado para validación visual
    setTouchedFields(prev => ({
      ...prev,
      extras: true
    }));
  };

  /**
   * Maneja la carga de archivos con preview y detección de cambios
   * @param {Event} e - Evento del input file
   * @param {string} tipo - Tipo de depósito ('primer' o 'segundo')
   */
  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipos de archivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        swalHelpers.showError(
          'Tipo de archivo no válido',
          'Por favor selecciona solo archivos de imagen, PDF o documentos Word'
        );
        return;
      }

      // Crear preview usando FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviewUrl = e.target.result;
        
        if (tipo === 'primer') {
          // Verificar si el archivo ha cambiado comparando con el preview original
          const hasChanged = reservaData?.primerDepositoPreview !== newPreviewUrl;
          
          setPrimerDeposito(file);
          setPrimerDepositoPreview(newPreviewUrl);
          
          // Marcar campo como tocado para validación visual
          setTouchedFields(prev => ({
            ...prev,
            primerDeposito: true,
            primerDepositoChanged: hasChanged
          }));
        } else {
          // Verificar si el archivo ha cambiado comparando con el preview original
          const hasChanged = reservaData?.segundoDepositoPreview !== newPreviewUrl;
          
          setSegundoDeposito(file);
          setSegundoDepositoPreview(newPreviewUrl);
          
          // Marcar campo como tocado para validación visual
          setTouchedFields(prev => ({
            ...prev,
            segundoDeposito: true,
            segundoDepositoChanged: hasChanged
          }));
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
   * @returns {FormData|Object} Datos del formulario listos para enviar al servidor
   */
  const handleSubmit = (e, isEdit = false) => {
    e.preventDefault();
    
    // Verificar si hay archivos que han cambiado (para edición)
    const hasFileChanges = isEdit && (
      (primerDeposito && touchedFields.primerDepositoChanged) ||
      (segundoDeposito && touchedFields.segundoDepositoChanged)
    );
    
    // Para creación o si hay cambios de archivos, usar FormData
    if (!isEdit || hasFileChanges) {
      const submitFormData = new FormData();
      
      console.log('Usando FormData - hasFileChanges:', hasFileChanges);
      console.log('primerDeposito:', primerDeposito);
      console.log('segundoDeposito:', segundoDeposito);
      console.log('touchedFields:', touchedFields);
      
      // ===== DATOS DE LA CABAÑA =====
      submitFormData.append('cabanaId', cabañaSeleccionada);
      
      // Buscar información adicional de la cabaña
      const cabaña = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));
      if (cabaña) {
        submitFormData.append('cabanaNombre', cabaña.nombre);
        submitFormData.append('cabanaColor', cabaña.color);
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
      if (isEdit) {
        // Solo agregar archivos que han cambiado
        if (primerDeposito && touchedFields.primerDepositoChanged) {
          console.log('Agregando primer depósito:', primerDeposito.name);
          submitFormData.append('primerDeposito', primerDeposito);
        }
        if (segundoDeposito && touchedFields.segundoDepositoChanged) {
          console.log('Agregando segundo depósito:', segundoDeposito.name);
          submitFormData.append('segundoDeposito', segundoDeposito);
        }
      } else {
        // Para creación, agregar todos los archivos disponibles
        if (primerDeposito) {
          submitFormData.append('primerDeposito', primerDeposito);
        }
        if (segundoDeposito) {
          submitFormData.append('segundoDeposito', segundoDeposito);
        }
      }

      // ===== FLAG PARA EDICIÓN =====
      if (isEdit) {
        submitFormData.append('isEdit', 'true');
      }

      // Debug: mostrar contenido del FormData
      console.log('FormData entries:');
      for (let pair of submitFormData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
      }

      return submitFormData;
    } else {
      // Para edición sin archivos, usar objeto JSON
      console.log('Usando JSON Object - sin cambios de archivos');
      console.log('formData:', formData);
      
      const submitData = {
        // ===== DATOS DE LA CABAÑA =====
        cabanaId: cabañaSeleccionada,
        
        // Buscar información adicional de la cabaña
        ...((() => {
          const cabaña = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));
          return cabaña ? {
            cabanaNombre: cabaña.nombre,
            cabañaColor: cabaña.color
          } : {};
        })()),
        
        // ===== DATOS DEL FORMULARIO =====
        ...formData,
        
        // ===== FLAG PARA EDICIÓN =====
        isEdit: true
      };

      console.log('submitData JSON:', submitData);
      return submitData;
    }
  };

  // ===== DATOS DERIVADOS =====
  
  // Obtener la cabaña seleccionada para mostrar en el alert
  const cabañaActual = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));
  
  // Obtener la capacidad máxima de la cabaña seleccionada
  const capacidadMaxima = cabañaSeleccionada ? getCapacidadMaxima(parseInt(cabañaSeleccionada)) : null;

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
    capacidadMaxima,
    touchedFields,
    
    // Funciones
    handleCabañaChange,
    handleInputChange,
    handleInputBlur,
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
 * @param {boolean} isEditMode - Indica si es modo edición (no valida fechas pasadas)
 * @returns {Array} Array de mensajes de error (vacío si no hay errores)
 */
export const validateForm = (formData, cabañaSeleccionada, primerDeposito = null, segundoDeposito = null, isEditMode = false) => {
  const errors = [];

  // ===== VALIDACIONES OBLIGATORIAS =====
  
  // Validar selección de cabaña
  if (!cabañaSeleccionada) {
    errors.push("🏠 Debe seleccionar una cabaña");
  }

  // Validar tipo de reserva
  if (!formData.tipoReserva) {
    errors.push("📋 El tipo de reserva es requerido");
  }

  // Validar nombre del cliente
  if (!formData.nombreCliente || !formData.nombreCliente.trim()) {
    errors.push("👤 El nombre del cliente es requerido");
  } else if (formData.nombreCliente.trim().length < 2) {
    errors.push("👤 El nombre del cliente debe tener al menos 2 caracteres");
  }

  // Validar email del cliente
  if (!formData.emailCliente || !formData.emailCliente.trim()) {
    errors.push("📧 El correo del cliente es requerido");
  } else {
    // Validar formato de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailCliente.trim())) {
      errors.push("📧 El formato del correo electrónico no es válido (ejemplo: usuario@dominio.com)");
    }
  }

  // ===== VALIDACIONES NUMÉRICAS =====
  
  // Validar cantidad de personas
  if (!formData.cantidadPersonas || formData.cantidadPersonas < 1) {
    errors.push("👥 Debe seleccionar la cantidad de personas (mínimo 1)");
  }

  // Validar total depositado
  if (!formData.totalDepositado) {
    errors.push("💰 El total depositado es requerido");
  } else if (parseFloat(formData.totalDepositado) <= 0) {
    errors.push("💰 El total depositado debe ser mayor a 0");
  } else if (isNaN(parseFloat(formData.totalDepositado))) {
    errors.push("💰 El total depositado debe ser un número válido");
  }

  
  // Validar fecha de ingreso
  if (!formData.fechaIngreso) {
    errors.push("📅 La fecha de ingreso es requerida");
  }

  // Validar fecha de salida
  if (!formData.fechaSalida) {
    errors.push("📅 La fecha de salida es requerida");
  }

  // Validar que la fecha de salida sea igual o posterior a la de ingreso
  if (formData.fechaIngreso && formData.fechaSalida) {
    const fechaIngreso = new Date(formData.fechaIngreso);
    const fechaSalida = new Date(formData.fechaSalida);
    
    if (fechaIngreso > fechaSalida) {
      errors.push("📅 La fecha de salida debe ser igual o posterior a la fecha de ingreso");
    }
  }

  // ===== VALIDACIONES DE HORARIOS =====
  
  // Validar hora de ingreso
  if (!formData.horaIngreso) {
    errors.push("🕐 La hora de ingreso es requerida");
  }

  // Validar hora de salida
  if (!formData.horaSalida) {
    errors.push("🕐 La hora de salida es requerida");
  }

  // ===== VALIDACIONES DE TIPOS DE PAGO (CONDICIONALES) =====
  
  // Validar tipo de pago primer depósito solo si hay imagen
  if (primerDeposito && !formData.tipoPagoPrimerDeposito) {
    errors.push("💳 El tipo de pago del primer depósito es requerido cuando hay una imagen seleccionada");
  }

  // Validar tipo de pago segundo depósito solo si hay imagen Y el depósito no es 100%
  if (segundoDeposito && !formData.tipoPagoSegundoDeposito && formData.deposito !== "100%") {
    errors.push("💳 El tipo de pago del segundo depósito es requerido cuando hay una imagen seleccionada");
  }

  return errors;
};

/**
 * ========================================
 * FUNCIÓN PARA VALIDAR CAMPOS INDIVIDUALES
 * ========================================
 * Valida un campo específico y retorna el mensaje de error si existe
 * 
 * @param {string} fieldName - Nombre del campo
 * @param {any} value - Valor del campo
 * @param {Object} formData - Datos completos del formulario (para validaciones cruzadas)
 * @param {string} cabañaSeleccionada - ID de la cabaña seleccionada
 * @param {boolean} isEditMode - Indica si es modo edición (no valida fechas pasadas)
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const validateField = (fieldName, value, formData = {}, cabañaSeleccionada = "", isEditMode = false) => {
  switch (fieldName) {
    case "cabañaId":
      if (!cabañaSeleccionada) return "Debe seleccionar una cabaña";
      break;
    case "nombreCliente":
      if (!value || !value.trim()) return "El nombre del cliente es requerido";
      if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
      break;
    case "emailCliente":
      if (!value || !value.trim()) return "El correo del cliente es requerido";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return "El formato del correo no es válido";
      break;
    case "cantidadPersonas":
      if (!value || value < 1) return "Debe seleccionar la cantidad de personas";
      break;
    case "totalDepositado":
      if (!value) return "El total depositado es requerido";
      if (parseFloat(value) <= 0) return "El total debe ser mayor a 0";
      if (isNaN(parseFloat(value))) return "Debe ser un número válido";
      break;
    case "fechaIngreso":
      if (!value) return "La fecha de ingreso es requerida";
      break;
    case "fechaSalida":
      if (!value) return "La fecha de salida es requerida";
      if (formData.fechaIngreso && value) {
        const fechaIngreso = new Date(formData.fechaIngreso);
        const fechaSalida = new Date(value);
        if (fechaIngreso > fechaSalida) return "Debe ser igual o posterior a la fecha de ingreso";
      }
      break;
    case "horaIngreso":
      if (!value) return "La hora de ingreso es requerida";
      break;
    case "horaSalida":
      if (!value) return "La hora de salida es requerida";
      break;
    case "tipoReserva":
      if (!value) return "El tipo de reserva es requerido";
      break;
    default:
      return null;
  }
  return null;
};

/**
 * ========================================
 * FUNCIÓN PARA OBTENER MENSAJE DE ERROR INDIVIDUAL
 * ========================================
 * Retorna el mensaje de error específico para un campo si es inválido
 * 
 * @param {string} fieldName - Nombre del campo
 * @param {Object} formData - Datos del formulario
 * @param {Object} touchedFields - Campos que han sido tocados
 * @param {string} cabañaSeleccionada - ID de la cabaña seleccionada
 * @param {boolean} isEditMode - Indica si es modo edición (no valida fechas pasadas)
 * @returns {string|null} Mensaje de error o null si es válido
 */
export const getFieldError = (fieldName, formData, touchedFields, cabañaSeleccionada = "", isEditMode = false) => {
  const isTouched = touchedFields[fieldName];
  
  // Si el campo no ha sido tocado, no mostrar error
  if (!isTouched) return null;
  
  // Usar la función validateField para obtener el error específico
  return validateField(fieldName, formData[fieldName], formData, cabañaSeleccionada, isEditMode);
};

/**
 * ========================================
 * FUNCIÓN PARA OBTENER CLASES DE VALIDACIÓN
 * ========================================
 * Retorna las clases CSS para mostrar errores de validación visual
 * 
 * @param {string} fieldName - Nombre del campo
 * @param {Object} formData - Datos del formulario
 * @param {Object} touchedFields - Campos que han sido tocados
 * @param {string} cabañaSeleccionada - ID de la cabaña seleccionada
 * @returns {string} Clases CSS para el campo
 */
export const getValidationClasses = (fieldName, formData, touchedFields, cabañaSeleccionada = "") => {
  const isTouched = touchedFields[fieldName];
  const value = formData[fieldName];
  
  // Determinar el tipo de campo para aplicar las clases correctas
  const isSelectField = ['cabañaId', 'tipoReserva', 'cantidadPersonas', 'nacionalidad', 'mascotas', 'deposito', 'moneda', 'tipoPagoPrimerDeposito', 'tipoPagoSegundoDeposito'].includes(fieldName);
  const baseClasses = isSelectField ? "form-select" : "form-control";
  
  // Si el campo no ha sido tocado, retornar clases base
  if (!isTouched) return baseClasses;
  
  // Validaciones específicas por campo
  let isValid = true;
  
  switch (fieldName) {
    case "cabañaId":
      isValid = cabañaSeleccionada && cabañaSeleccionada !== "";
      break;
    case "nombreCliente":
      isValid = value && value.trim() !== "";
      break;
    case "emailCliente":
      isValid = value && value.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      break;
    case "cantidadPersonas":
      isValid = value && value !== "" && value !== "0";
      break;
    case "totalDepositado":
      isValid = value && parseFloat(value) > 0;
      break;
    case "fechaIngreso":
      isValid = value && value !== "";
      break;
    case "fechaSalida":
      isValid = value && value !== "";
      // Validación adicional: fecha de salida debe ser igual o posterior a la de ingreso
      if (isValid && formData.fechaIngreso && value) {
        const fechaIngreso = new Date(formData.fechaIngreso);
        const fechaSalida = new Date(value);
        isValid = fechaSalida >= fechaIngreso;
      }
      break;
    case "horaIngreso":
      isValid = value && value !== "";
      break;
    case "horaSalida":
      isValid = value && value !== "";
      break;
    case "tipoReserva":
      isValid = value && value !== "";
      break;
    case "deposito":
      isValid = value && value !== "";
      break;
    case "moneda":
      isValid = value && value !== "";
      break;
    case "tipoPagoPrimerDeposito":
      // Solo validar si hay imagen del primer depósito
      isValid = true; // Este campo es opcional si no hay imagen
      break;
    case "tipoPagoSegundoDeposito":
      // Solo validar si hay imagen del segundo depósito y depósito es 50%
      isValid = true; // Este campo es opcional
      break;
    default:
      isValid = true;
  }
  
  return isValid ? baseClasses : `${baseClasses} is-invalid`;
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
