import { useState } from "react";
import { getCabañasColores } from "../../../../hooks/CabanasDisponibles";

// Opciones para los selects
export const opcionesDeposito = ["50%", "100%"];
export const opcionesMoneda = ["Colones", "Dólares"];
export const opcionesTipoPago = ["Sinpe móvil", "Depósito"];
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

// Estado inicial del formulario
export const getInitialFormState = (reservaData = null) => ({
  nombreCliente: reservaData?.nombreCliente || "",
  emailCliente: reservaData?.emailCliente || "",
  cantidadPersonas: reservaData?.cantidadPersonas || 1,
  deposito: reservaData?.deposito || "50%",
  moneda: reservaData?.moneda || "Colones",
  totalDepositado: reservaData?.totalDepositado || "",
  horaIngreso: reservaData?.horaIngreso || "15:00",
  horaSalida: reservaData?.horaSalida || "11:00",
  fechaIngreso: reservaData?.fechaIngreso || "",
  fechaSalida: reservaData?.fechaSalida || "",
  tipoPagoPrimerDeposito: reservaData?.tipoPagoPrimerDeposito || "Sinpe móvil",
  tipoPagoSegundoDeposito: reservaData?.tipoPagoSegundoDeposito || "Sinpe móvil",
  extras: reservaData?.extras || []
});

// Hook personalizado para manejar el formulario de reservas
export const useReservaForm = (reservaData = null) => {
  const [cabañaSeleccionada, setCabañaSeleccionada] = useState(reservaData?.cabañaId || "");
  const [formData, setFormData] = useState(getInitialFormState(reservaData));
  
  // Estados para los archivos y previews
  const [primerDeposito, setPrimerDeposito] = useState(null);
  const [segundoDeposito, setSegundoDeposito] = useState(null);
  const [primerDepositoPreview, setPrimerDepositoPreview] = useState(reservaData?.primerDepositoPreview || null);
  const [segundoDepositoPreview, setSegundoDepositoPreview] = useState(reservaData?.segundoDepositoPreview || null);

  const cabañas = getCabañasColores();

  const handleCabañaChange = (e) => {
    const cabañaId = e.target.value;
    setCabañaSeleccionada(cabañaId);
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

  // Función para manejar la carga de archivos con preview
  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen');
        return;
      }

      // Crear preview
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

  // Función para eliminar archivo y preview
  const handleRemoveFile = (tipo) => {
    if (tipo === 'primer') {
      setPrimerDeposito(null);
      setPrimerDepositoPreview(null);
    } else {
      setSegundoDeposito(null);
      setSegundoDepositoPreview(null);
    }
  };

  const handleSubmit = (e, isEdit = false) => {
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

    // Agregar archivos
    if (primerDeposito) {
      submitFormData.append('primerDeposito', primerDeposito);
    }
    if (segundoDeposito) {
      submitFormData.append('segundoDeposito', segundoDeposito);
    }

    // Agregar flag para edición
    if (isEdit) {
      submitFormData.append('isEdit', 'true');
    }
    
    // Aquí puedes enviar el FormData al servidor
    console.log('FormData creado:', submitFormData);
    
    // Mostrar los datos en consola para verificación
    for (let [key, value] of submitFormData.entries()) {
      console.log(`${key}: ${value}`);
    }

    return submitFormData;
  };

  // Obtener la cabaña seleccionada para mostrar en el alert
  const cabañaActual = cabañas.find(c => c.id === parseInt(cabañaSeleccionada));

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

// Función para validar el formulario
export const validateForm = (formData, cabañaSeleccionada) => {
  const errors = [];

  if (!cabañaSeleccionada) {
    errors.push("Debe seleccionar una cabaña");
  }

  if (!formData.nombreCliente.trim()) {
    errors.push("El nombre del cliente es requerido");
  }

  if (!formData.emailCliente.trim()) {
    errors.push("El correo del cliente es requerido");
  } else {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailCliente)) {
      errors.push("El formato del correo electrónico no es válido");
    }
  }

  if (!formData.cantidadPersonas || formData.cantidadPersonas < 1) {
    errors.push("La cantidad de personas debe ser al menos 1");
  }

  if (!formData.totalDepositado || parseFloat(formData.totalDepositado) <= 0) {
    errors.push("El total depositado debe ser mayor a 0");
  }

  if (!formData.fechaIngreso) {
    errors.push("La fecha de ingreso es requerida");
  }

  if (!formData.fechaSalida) {
    errors.push("La fecha de salida es requerida");
  }

  if (formData.fechaIngreso && formData.fechaSalida) {
    const fechaIngreso = new Date(formData.fechaIngreso);
    const fechaSalida = new Date(formData.fechaSalida);
    
    if (fechaIngreso >= fechaSalida) {
      errors.push("La fecha de salida debe ser posterior a la fecha de ingreso");
    }
  }

  if (!formData.tipoPagoPrimerDeposito) {
    errors.push("El tipo de pago del primer depósito es requerido");
  }

  if (!formData.tipoPagoSegundoDeposito) {
    errors.push("El tipo de pago del segundo depósito es requerido");
  }

  return errors;
};

// Función para formatear datos para mostrar
export const formatReservaData = (reserva) => {
  return {
    ...reserva,
    fechaIngreso: reserva.fechaIngreso ? new Date(reserva.fechaIngreso).toISOString().split('T')[0] : '',
    fechaSalida: reserva.fechaSalida ? new Date(reserva.fechaSalida).toISOString().split('T')[0] : '',
    extras: Array.isArray(reserva.extras) ? reserva.extras : JSON.parse(reserva.extras || '[]')
  };
};
