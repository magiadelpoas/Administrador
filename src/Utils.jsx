/**
 * Utils.js - Funciones utilitarias para el formulario de reservación
 * Centraliza toda la lógica de manejo de formulario, traducciones y validaciones
 */

// Import de SweetAlert2 para validaciones
import Swal from 'sweetalert2'

/**
 * Obtiene el idioma inicial desde localStorage o retorna español por defecto
 * @returns {string} Idioma inicial ('es' o 'en')
 */
export const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('preferredLanguage')
  return savedLanguage || 'es'
}

/**
 * Guarda la preferencia de idioma en localStorage
 * @param {string} language - Idioma a guardar ('es' o 'en')
 */
export const saveLanguagePreference = (language) => {
  localStorage.setItem('preferredLanguage', language)
}

/**
 * Alterna entre idiomas español e inglés
 * @param {string} currentLanguage - Idioma actual
 * @returns {string} Nuevo idioma
 */
export const toggleLanguage = (currentLanguage) => {
  const newLanguage = currentLanguage === 'es' ? 'en' : 'es'
  saveLanguagePreference(newLanguage)
  return newLanguage
}

/**
 * Maneja el cambio de inputs de texto, select y checkbox
 * @param {Event} e - Evento del input
 * @param {Object} currentFormData - Datos actuales del formulario
 * @returns {Object} Nuevos datos del formulario
 */
export const handleInputChange = (e, currentFormData) => {
  const { name, value, type, checked, files, multiple, selectedOptions } = e.target
  
  if (type === 'checkbox') {
    return {
      ...currentFormData,
      [name]: checked
    }
  } else if (type === 'file') {
    return {
      ...currentFormData,
      [name]: files[0]
    }
  } else if (multiple && name === 'extras') {
    // Maneja múltiples selecciones para extras
    const selectedValues = Array.from(selectedOptions, option => option.value)
    return {
      ...currentFormData,
      [name]: selectedValues
    }
  } else {
    const newFormData = {
      ...currentFormData,
      [name]: value
    }
    
    // Si se selecciona cabaña Roble Escondido (4) o Colima (6), forzar mascotas a 'No'
    if (name === 'cabana' && (value === '4' || value === '6')) {
      newFormData.mascotas = 'No'
    }
    
    // Si se cambia de cabaña, resetear la cantidad de personas
    if (name === 'cabana') {
      newFormData.cantidadPersonas = '2' // Valor por defecto
    }
    
    return newFormData
  }
}

/**
 * Maneja el cambio de campos de fecha
 * @param {string} name - Nombre del campo de fecha
 * @param {Object} date - Objeto de fecha de dayjs
 * @param {Object} currentFormData - Datos actuales del formulario
 * @param {string} language - Idioma actual ('es' o 'en')
 * @returns {Object} Nuevos datos del formulario
 */
export const handleDateChange = (name, date, currentFormData, language = 'es') => {
  return {
    ...currentFormData,
    [name]: date
  }
}

/**
 * Maneja el cambio de archivos (para campos de Material-UI)
 * @param {Event} e - Evento del input de archivo
 * @param {Object} currentFormData - Datos actuales del formulario
 * @returns {Object} Nuevos datos del formulario
 */
export const handleFileChange = (e, currentFormData) => {
  const file = e.target.files[0]
  const fieldName = e.target.name
  return {
    ...currentFormData,
    [fieldName]: file
  }
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento de envío
 * @param {Object} formData - Datos del formulario
 * @param {string} language - Idioma actual ('es' o 'en')
 */
export const handleSubmit = async (e, formData, language = 'es') => {
  e.preventDefault()
  
  // Mostrar confirmación antes de enviar
  const confirmResult = await Swal.fire({
    title: language === 'es' ? '¿Confirmar Reserva?' : 'Confirm Reservation?',
    text: language === 'es' ? '¿Está seguro de que desea crear esta reserva?' : 'Are you sure you want to create this reservation?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#6a64f1',
    cancelButtonColor: '#d33',
    confirmButtonText: language === 'es' ? 'Sí, crear reserva' : 'Yes, create reservation',
    cancelButtonText: language === 'es' ? 'Cancelar' : 'Cancel',
    allowOutsideClick: false,
    allowEscapeKey: false
  })
  
  // Si el usuario cancela, no proceder
  if (!confirmResult.isConfirmed) {
    return
  }
  
  // Mostrar loading
  Swal.fire({
    title: language === 'es' ? 'Enviando Reserva...' : 'Sending Reservation...',
    text: language === 'es' ? 'Por favor espere mientras procesamos su solicitud' : 'Please wait while we process your request',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
  
  try {
    // Crear FormData para enviar archivos
    const formDataToSend = new FormData()
    
    // Agregar campos de texto
    formDataToSend.append('cabana', formData.cabana)
    formDataToSend.append('fullname', formData.fullname)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('phone', formData.phone || '')
    formDataToSend.append('currency', formData.currency)
    formDataToSend.append('totalDepositado', formData.totalDepositado || '')
    formDataToSend.append('cantidadPersonas', formData.cantidadPersonas)
    formDataToSend.append('pais', formData.pais)
    formDataToSend.append('deposito', formData.deposito)
    formDataToSend.append('mascotas', formData.mascotas)
    formDataToSend.append('declaration', formData.declaration)
    
    // Agregar fechas (convertir dayjs a string)
    if (formData.fechaIngreso) {
      let fechaIngresoString = ''
      if (typeof formData.fechaIngreso === 'string') {
        fechaIngresoString = formData.fechaIngreso
      } else if (formData.fechaIngreso && typeof formData.fechaIngreso.format === 'function') {
        fechaIngresoString = formData.fechaIngreso.format('YYYY-MM-DD')
      } else if (formData.fechaIngreso && formData.fechaIngreso.isValid && formData.fechaIngreso.isValid()) {
        fechaIngresoString = formData.fechaIngreso.format('YYYY-MM-DD')
      }
      if (fechaIngresoString) {
        formDataToSend.append('fechaIngreso', fechaIngresoString)
      }
    }
    
    if (formData.fechaSalida) {
      let fechaSalidaString = ''
      if (typeof formData.fechaSalida === 'string') {
        fechaSalidaString = formData.fechaSalida
      } else if (formData.fechaSalida && typeof formData.fechaSalida.format === 'function') {
        fechaSalidaString = formData.fechaSalida.format('YYYY-MM-DD')
      } else if (formData.fechaSalida && formData.fechaSalida.isValid && formData.fechaSalida.isValid()) {
        fechaSalidaString = formData.fechaSalida.format('YYYY-MM-DD')
      }
      if (fechaSalidaString) {
        formDataToSend.append('fechaSalida', fechaSalidaString)
      }
    }
    
    // Agregar extras (convertir array a JSON)
    if (formData.extras && Array.isArray(formData.extras)) {
      formDataToSend.append('extras', JSON.stringify(formData.extras))
    }
    
    // Agregar archivos
    if (formData.proofOfAddress) {
      formDataToSend.append('proofOfAddress', formData.proofOfAddress)
    }
    if (formData.proofOfAddress2) {
      formDataToSend.append('proofOfAddress2', formData.proofOfAddress2)
    }
    
    // Determinar la URL según el entorno
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    // Usar el dominio correcto de la API
    const endpointURL = 'https://apimagia.magiadelpoas.com/api/landing/reservas'
    
    
    // Enviar petición al endpoint del landing
    const response = await fetch(endpointURL, {
      method: 'POST',
      body: formDataToSend
    })
    
    // Verificar si la respuesta es JSON válido
    let result
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      // Si no es JSON, crear un objeto de error
      const textResponse = await response.text()
      result = {
        success: false,
        message: 'Error del servidor: respuesta inválida'
      }
    }
    
    if (response.ok && result.success) {
      // Obtener datos de la reserva para el mensaje de WhatsApp
      const nombre = formData.fullname
      const fi = formData.fechaIngreso ? (typeof formData.fechaIngreso === 'string' ? formData.fechaIngreso : formData.fechaIngreso.format('YYYY-MM-DD')) : ''
      const ff = formData.fechaSalida ? (typeof formData.fechaSalida === 'string' ? formData.fechaSalida : formData.fechaSalida.format('YYYY-MM-DD')) : ''
      
      // Mapear ID de cabaña a nombre
      const cabanaNames = {
        '1': 'ANTÍA',
        '2': 'LILLIAM', 
        '3': 'LUNA',
        '4': 'ROBLE ESCONDIDO',
        '5': 'GLAMPING',
        '6': 'COLIMA'
      }
      const name = cabanaNames[formData.cabana] || 'Cabaña'
      
      // Obtener ID de referencia (usar el ID de la reserva si está disponible)
      const idReferencia = result.data?.id_reserva || 'Pendiente'
      const deposito = formData.deposito || '50%'
      const moneda = formData.currency || 'Colones'
      const cantidad = formData.totalDepositado || '0'
      
      // Crear mensaje de WhatsApp según el idioma
      const mensaje = language === 'es' 
        ? `Hola mi nombre es ${nombre} y acabo de crear esta reserva, check in ${fi} y check out ${ff} en cabaña ${name}, \nEste es mi ID de referencia: #(${idReferencia}) con un pago del ${deposito}, ${moneda} ${cantidad}.`
        : `Hello my name is ${nombre} and I just created this reservation, check in ${fi} and check out ${ff} in cabin ${name}, \nThis is my reference ID: #(${idReferencia}) with a payment of ${deposito}, ${moneda} ${cantidad}.`
      
      // Configurar WhatsApp
      const numero = "+50687234000"
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      let url = isMobile 
        ? `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensaje)}`
        : `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`
      
      // Mostrar mensaje de confirmación
      Swal.fire({
        icon: 'success',
        title: language === 'es' ? '¡Reserva Enviada!' : 'Reservation Sent!',
        text: language === 'es' ? 'Su reserva ha sido enviada exitosamente. Se abrirá WhatsApp automáticamente en 3 segundos...' : 'Your reservation has been sent successfully. WhatsApp will open automatically in 3 seconds...',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      })
      
      // Abrir WhatsApp después de 3 segundos
      setTimeout(() => {
        window.open(url, '_blank')
      }, 3000)
      
      // Opcional: resetear el formulario
      // window.location.reload()
      
    } else {
      // Error - mostrar mensaje de error
      Swal.fire({
        icon: 'error',
        title: language === 'es' ? 'Error al Enviar' : 'Send Error',
        text: result.message || (language === 'es' ? 'Hubo un error al enviar su reserva. Por favor, intente nuevamente.' : 'There was an error sending your reservation. Please try again.'),
        confirmButtonText: language === 'es' ? 'Entendido' : 'OK'
      })
    }
    
  } catch (error) {
    
    // Determinar el tipo de error y mostrar mensaje apropiado
    let errorTitle = language === 'es' ? 'Error de Conexión' : 'Connection Error'
    let errorText = language === 'es' ? 'No se pudo conectar con el servidor. Por favor, verifique su conexión e intente nuevamente.' : 'Could not connect to the server. Please check your connection and try again.'
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorTitle = language === 'es' ? 'Error de Conexión' : 'Connection Error'
      errorText = language === 'es' 
        ? 'No se pudo conectar con el servidor. Esto puede ser debido a:\n\n• Problemas de conexión a internet\n• El servidor está temporalmente no disponible\n• Problemas de CORS\n\nPor favor, intente nuevamente en unos minutos.'
        : 'Could not connect to the server. This may be due to:\n\n• Internet connection problems\n• Server is temporarily unavailable\n• CORS issues\n\nPlease try again in a few minutes.'
    } else if (error.name === 'TypeError') {
      errorTitle = language === 'es' ? 'Error de Red' : 'Network Error'
      errorText = language === 'es' ? 'Error de red al intentar enviar la reserva. Verifique su conexión.' : 'Network error when trying to send the reservation. Check your connection.'
    } else {
      errorTitle = language === 'es' ? 'Error Inesperado' : 'Unexpected Error'
      errorText = language === 'es' ? `Error inesperado: ${error.message}` : `Unexpected error: ${error.message}`
    }
    
    Swal.fire({
      icon: 'error',
      title: errorTitle,
      text: errorText,
      confirmButtonText: language === 'es' ? 'Entendido' : 'OK',
      footer: language === 'es' ? 'Si el problema persiste, contacte al administrador del sistema.' : 'If the problem persists, contact the system administrator.'
    })
  }
}

/**
 * Estado inicial del formulario
 */
export const initialFormData = {
  cabana: '',
  fullname: '',
  email: '',
  phone: '',
  currency: 'Colones',
  totalDepositado: '',
  fechaIngreso: null,
  fechaSalida: null,
  cantidadPersonas: '2',
  pais: 'Costa Rica',
  deposito: '50%',
  extras: ['1'],
  mascotas: 'No',
  proofOfAddress: null,
  proofOfAddress2: null,
  declaration: false
}

/**
 * Objeto de traducciones completo
 * Contiene todas las traducciones en español e inglés
 */
export const translations = {
  es: {
    formTitle: 'Formulario de Reservación',
    formDesc: 'Por favor, complete la información solicitada en el formulario. Los campos marcados con * son obligatorios.',
    selectCabin: 'Seleccione Cabaña',
    fullName: 'Nombre Completo*',
    email: 'Correo Electrónico',
    phone: 'Número de Teléfono (Opcional)',
    currency: 'Moneda',
    totalDepositado: 'Total Depositado',
    fechaIngreso: 'Fecha de Ingreso',
    fechaSalida: 'Fecha de Salida',
    cantidadPersonas: 'Personas',
    pais: 'País',
    deposito: 'Depósito %',
    extras: 'Seleccione las Extras',
    mascotasLabel: 'Mascotas',
    proofOfAddress: 'Subir Comprobante de Pago 1',
    proofOfAddress2: 'Subir Comprobante de Pago 2',
    declaration: 'Confirmo que la información proporcionada es precisa y completa.',
    submitButton: 'Enviar Reservación',
    
    // Placeholders para inputs
    placeholders: {
      fullName: 'Ingrese su nombre completo',
      email: 'Ingrese su correo electrónico',
      phone: 'Ingrese su número de teléfono'
    },
    
    // Opciones de cabañas
    cabins: {
      '': 'Click Aquí',
      '1': '1 .Estándar - ANTÍA',
      '2': '2 .Estándar - LILLIAM',
      '3': '3 .Deluxe - LUNA',
      '4': '4 .Deluxe - ROBLE ESCONDIDO',
      '5': '5 .Glamping',
      '6': '6 .Colima'
    },
    
    // Opciones de monedas
    currencies: {
      'Colones': '₡ Colones',
      'Dólares': '$ Dólares'
    },
    
    // Opciones de cantidad de personas
    personas: {
      '': 'Seleccionar',
      '1': '1 persona',
      '2': '2 personas',
      '3': '3 personas',
      '4': '4 personas',
      '5': 'Más de 4 personas'
    },
    
    // Lista completa de países
    paises: {
      'No especifica': 'Seleccione el país',
      'Afganistán': 'Afganistán',
      'Albania': 'Albania',
      'Alemania': 'Alemania',
      'Andorra': 'Andorra',
      'Angola': 'Angola',
      'Anguilla': 'Anguilla',
      'Antártida': 'Antártida',
      'Antigua y Barbuda': 'Antigua y Barbuda',
      'Antillas Holandesas': 'Antillas Holandesas',
      'Arabia Saudí': 'Arabia Saudí',
      'Argelia': 'Argelia',
      'Argentina': 'Argentina',
      'Armenia': 'Armenia',
      'Aruba': 'Aruba',
      'Australia': 'Australia',
      'Austria': 'Austria',
      'Azerbaiyán': 'Azerbaiyán',
      'Bahamas': 'Bahamas',
      'Bahrein': 'Bahrein',
      'Bangladesh': 'Bangladesh',
      'Barbados': 'Barbados',
      'Bélgica': 'Bélgica',
      'Belice': 'Belice',
      'Benin': 'Benin',
      'Bermudas': 'Bermudas',
      'Bielorrusia': 'Bielorrusia',
      'Birmania': 'Birmania',
      'Bolivia': 'Bolivia',
      'Bosnia y Herzegovina': 'Bosnia y Herzegovina',
      'Botswana': 'Botswana',
      'Brasil': 'Brasil',
      'Brunei': 'Brunei',
      'Bulgaria': 'Bulgaria',
      'Burkina Faso': 'Burkina Faso',
      'Burundi': 'Burundi',
      'Bután': 'Bután',
      'Cabo Verde': 'Cabo Verde',
      'Camboya': 'Camboya',
      'Camerún': 'Camerún',
      'Canadá': 'Canadá',
      'Chad': 'Chad',
      'Chile': 'Chile',
      'China': 'China',
      'Chipre': 'Chipre',
      'Ciudad del Vaticano': 'Ciudad del Vaticano (Santa Sede)',
      'Colombia': 'Colombia',
      'Comores': 'Comores',
      'Congo': 'Congo',
      'Congo, República Democrática del': 'Congo, República Democrática del',
      'Corea': 'Corea',
      'Corea del Norte': 'Corea del Norte',
      'Costa de Marfíl': 'Costa de Marfíl',
      'Costa Rica': 'Costa Rica',
      'Croacia Hrvatska': 'Croacia (Hrvatska)',
      'Cuba': 'Cuba',
      'Dinamarca': 'Dinamarca',
      'Djibouti': 'Djibouti',
      'Dominica': 'Dominica',
      'Ecuador': 'Ecuador',
      'Egipto': 'Egipto',
      'El Salvador': 'El Salvador',
      'Emiratos Árabes Unidos': 'Emiratos Árabes Unidos',
      'Eritrea': 'Eritrea',
      'Eslovenia': 'Eslovenia',
      'España': 'España',
      'Estados Unidos': 'Estados Unidos',
      'Estonia': 'Estonia',
      'Etiopía': 'Etiopía',
      'Fiji': 'Fiji',
      'Filipinas': 'Filipinas',
      'Finlandia': 'Finlandia',
      'Francia': 'Francia',
      'Gabón': 'Gabón',
      'Gambia': 'Gambia',
      'Georgia': 'Georgia',
      'Ghana': 'Ghana',
      'Gibraltar': 'Gibraltar',
      'Granada': 'Granada',
      'Grecia': 'Grecia',
      'Groenlandia': 'Groenlandia',
      'Guadalupe': 'Guadalupe',
      'Guam': 'Guam',
      'Guatemala': 'Guatemala',
      'Guayana': 'Guayana',
      'Guayana Francesa': 'Guayana Francesa',
      'Guinea': 'Guinea',
      'Guinea Ecuatorial': 'Guinea Ecuatorial',
      'Guinea-Bissau': 'Guinea-Bissau',
      'Haití': 'Haití',
      'Honduras': 'Honduras',
      'Hungría': 'Hungría',
      'India': 'India',
      'Indonesia': 'Indonesia',
      'Irak': 'Irak',
      'Irán': 'Irán',
      'Irlanda': 'Irlanda',
      'Isla Bouvet': 'Isla Bouvet',
      'Isla de Christmas': 'Isla de Christmas',
      'Islandia': 'Islandia',
      'Islas Caimán': 'Islas Caimán',
      'Islas Cook': 'Islas Cook',
      'Islas de Cocos o Keeling': 'Islas de Cocos o Keeling',
      'Islas Faroe': 'Islas Faroe',
      'Islas Heard y McDonald': 'Islas Heard y McDonald',
      'Islas Malvinas': 'Islas Malvinas',
      'Islas Marianas del Norte': 'Islas Marianas del Norte',
      'Islas Marshall': 'Islas Marshall',
      'Islas menores de Estados Unidos': 'Islas menores de Estados Unidos',
      'Islas Palau': 'Islas Palau',
      'Islas Salomón': 'Islas Salomón',
      'Islas Svalbard y Jan Mayen': 'Islas Svalbard y Jan Mayen',
      'Islas Tokelau': 'Islas Tokelau',
      'Islas Turks y Caicos': 'Islas Turks y Caicos',
      'Islas Vírgenes (EEUU)': 'Islas Vírgenes (EEUU)',
      'Islas Vírgenes (Reino Unido)': 'Islas Vírgenes (Reino Unido)',
      'Islas Wallis y Futuna': 'Islas Wallis y Futuna',
      'Israel': 'Israel',
      'Italia': 'Italia',
      'Jamaica': 'Jamaica',
      'Japón': 'Japón',
      'Jordania': 'Jordania',
      'Kazajistán': 'Kazajistán',
      'Kenia': 'Kenia',
      'Kirguizistán': 'Kirguizistán',
      'Kiribati': 'Kiribati',
      'Kuwait': 'Kuwait',
      'Laos': 'Laos',
      'Lesotho': 'Lesotho',
      'Letonia': 'Letonia',
      'Líbano': 'Líbano',
      'Liberia': 'Liberia',
      'Libia': 'Libia',
      'Liechtenstein': 'Liechtenstein',
      'Lituania': 'Lituania',
      'Luxemburgo': 'Luxemburgo',
      'Macedonia, Ex-República Yugoslava de': 'Macedonia, Ex-República',
      'Madagascar': 'Madagascar',
      'Malasia': 'Malasia',
      'Malawi': 'Malawi',
      'Maldivas': 'Maldivas',
      'Malí': 'Malí',
      'Malta': 'Malta',
      'Marruecos': 'Marruecos',
      'Martinica': 'Martinica',
      'Mauricio': 'Mauricio',
      'Mauritania': 'Mauritania',
      'Mayotte': 'Mayotte',
      'México': 'México',
      'Micronesia': 'Micronesia',
      'Moldavia': 'Moldavia',
      'Mónaco': 'Mónaco',
      'Mongolia': 'Mongolia',
      'Montserrat': 'Montserrat',
      'Mozambique': 'Mozambique',
      'Namibia': 'Namibia',
      'Nauru': 'Nauru',
      'Nepal': 'Nepal',
      'Nicaragua': 'Nicaragua',
      'Níger': 'Níger',
      'Nigeria': 'Nigeria',
      'Niue': 'Niue',
      'Norfolk': 'Norfolk',
      'Noruega': 'Noruega',
      'Nueva Caledonia': 'Nueva Caledonia',
      'Nueva Zelanda': 'Nueva Zelanda',
      'Omán': 'Omán',
      'Países Bajos': 'Países Bajos',
      'Panamá': 'Panamá',
      'Papúa Nueva Guinea': 'Papúa Nueva Guinea',
      'Paquistán': 'Paquistán',
      'Paraguay': 'Paraguay',
      'Perú': 'Perú',
      'Pitcairn': 'Pitcairn',
      'Polinesia Francesa': 'Polinesia Francesa',
      'Polonia': 'Polonia',
      'Portugal': 'Portugal',
      'Puerto Rico': 'Puerto Rico',
      'Qatar': 'Qatar',
      'Reino Unido': 'Reino Unido',
      'República Centroafricana': 'República Centroafricana',
      'República Checa': 'República Checa',
      'República de Sudáfrica': 'República de Sudáfrica',
      'República Dominicana': 'República Dominicana',
      'República Eslovaca': 'República Eslovaca',
      'Reunión': 'Reunión',
      'Ruanda': 'Ruanda',
      'Rumania': 'Rumania',
      'Rusia': 'Rusia',
      'Sahara Occidental': 'Sahara Occidental',
      'Saint Kitts y Nevis': 'Saint Kitts y Nevis',
      'Samoa': 'Samoa',
      'Samoa Americana': 'Samoa Americana',
      'San Marino': 'San Marino',
      'San Vicente y Granadinas': 'San Vicente y Granadinas',
      'Santa Helena': 'Santa Helena',
      'Santa Lucía': 'Santa Lucía',
      'Santo Tomé y Príncipe': 'Santo Tomé y Príncipe',
      'Senegal': 'Senegal',
      'Seychelles': 'Seychelles',
      'Sierra Leona': 'Sierra Leona',
      'Singapur': 'Singapur',
      'Siria': 'Siria',
      'Somalia': 'Somalia',
      'Sri Lanka': 'Sri Lanka',
      'St Pierre y Miquelon': 'St Pierre y Miquelon',
      'Suazilandia': 'Suazilandia',
      'Sudán': 'Sudán',
      'Suecia': 'Suecia',
      'Suiza': 'Suiza',
      'Surinam': 'Surinam',
      'Tailandia': 'Tailandia',
      'Taiwán': 'Taiwán',
      'Tanzania': 'Tanzania',
      'Tayikistán': 'Tayikistán',
      'Territorios franceses del Sur': 'Territorios franceses del Sur',
      'Timor Oriental': 'Timor Oriental',
      'Togo': 'Togo',
      'Tonga': 'Tonga',
      'Trinidad y Tobago': 'Trinidad y Tobago',
      'Túnez': 'Túnez',
      'Turkmenistán': 'Turkmenistán',
      'Turquía': 'Turquía',
      'Tuvalu': 'Tuvalu',
      'Ucrania': 'Ucrania',
      'Uganda': 'Uganda',
      'Uruguay': 'Uruguay',
      'Uzbekistán': 'Uzbekistán',
      'Vanuatu': 'Vanuatu',
      'Venezuela': 'Venezuela',
      'Vietnam': 'Vietnam',
      'Yemen': 'Yemen',
      'Yugoslavia': 'Yugoslavia',
      'Zambia': 'Zambia',
      'Zimbabue': 'Zimbabue'
    },
    
    // Opciones de depósito
    depositos: {
      '': 'Seleccionar',
      '50%': '50%',
      '100%': '100%'
    },
    
    // Opciones de extras
    extrasOptions: {
      '1': 'No',
      'Tabla de fiambres': 'Tabla de fiambres',
      'Tabla de fresas': 'Tabla de fresas',
      'Tabla de fiambres + vino': 'Tabla de fiambres + vino',
      'Vino': 'Vino',
      'Decoración pétalos': 'Decoración pétalos',
      'Globos': 'Globos',
      'Propuesta de matrimonio/ noviazgo': 'Propuesta de matrimonio/ noviazgo'
    },
    
    // Opciones de mascotas
    mascotasOptions: {
      '': 'Seleccionar',
      'Si': 'Si',
      'No': 'No'
    },
    
    // Mensajes de disponibilidad
    availabilityMessages: {
      available: '✅ Fechas disponibles',
      notAvailable: '❌ Fechas no disponibles',
      checking: '⏳ Verificando disponibilidad...'
    }
  },
  
  en: {
    formTitle: 'Reservation Form',
    formDesc: 'Please complete the requested information in the form. Fields marked with * are required.',
    selectCabin: 'Choose Cabin',
    fullName: 'Full Name*',
    email: 'Email Address',
    phone: 'Phone Number (Optional)',
    currency: 'Currency',
    totalDepositado: 'Total Deposit',
    fechaIngreso: 'Check In',
    fechaSalida: 'Check Out',
    cantidadPersonas: 'Number of People',
    pais: 'Country',
    deposito: 'Deposit %',
    extras: 'Choose Extras',
    mascotasLabel: 'Pets',
    proofOfAddress: 'Upload Payment Receipt 1',
    proofOfAddress2: 'Upload Payment Receipt 2',
    declaration: 'I confirm that the information provided is accurate and complete.',
    submitButton: 'Submit Reservation',
    
    // Placeholders para inputs
    placeholders: {
      fullName: 'Enter your full name',
      email: 'Enter your email',
      phone: 'Enter your phone number'
    },
    
    // Opciones de cabañas
    cabins: {
      '': 'Click Here',
      '1': '1 .Standard - ANTÍA',
      '2': '2 .Standard - LILLIAM',
      '3': '3 .Deluxe - LUNA',
      '4': '4 .Deluxe - ROBLE ESCONDIDO',
      '5': '5 .Glamping',
      '6': '6 .Colima'
    },
    
    // Opciones de monedas
    currencies: {
      'Colones': '₡ Colones',
      'Dólares': '$ Dollars'
    },
    
    // Opciones de cantidad de personas
    personas: {
      '': 'Select',
      '1': '1 person',
      '2': '2 people',
      '3': '3 people',
      '4': '4 people',
      '5': 'More than 4 people'
    },
    
    // Lista completa de países (traducidos al inglés)
    paises: {
      'No especifica': 'Select Country',
      'Afganistán': 'Afghanistan',
      'Albania': 'Albania',
      'Alemania': 'Germany',
      'Andorra': 'Andorra',
      'Angola': 'Angola',
      'Anguilla': 'Anguilla',
      'Antártida': 'Antarctica',
      'Antigua y Barbuda': 'Antigua and Barbuda',
      'Antillas Holandesas': 'Netherlands Antilles',
      'Arabia Saudí': 'Saudi Arabia',
      'Argelia': 'Algeria',
      'Argentina': 'Argentina',
      'Armenia': 'Armenia',
      'Aruba': 'Aruba',
      'Australia': 'Australia',
      'Austria': 'Austria',
      'Azerbaiyán': 'Azerbaijan',
      'Bahamas': 'Bahamas',
      'Bahrein': 'Bahrain',
      'Bangladesh': 'Bangladesh',
      'Barbados': 'Barbados',
      'Bélgica': 'Belgium',
      'Belice': 'Belize',
      'Benin': 'Benin',
      'Bermudas': 'Bermuda',
      'Bielorrusia': 'Belarus',
      'Birmania': 'Myanmar',
      'Bolivia': 'Bolivia',
      'Bosnia y Herzegovina': 'Bosnia and Herzegovina',
      'Botswana': 'Botswana',
      'Brasil': 'Brazil',
      'Brunei': 'Brunei',
      'Bulgaria': 'Bulgaria',
      'Burkina Faso': 'Burkina Faso',
      'Burundi': 'Burundi',
      'Bután': 'Bhutan',
      'Cabo Verde': 'Cape Verde',
      'Camboya': 'Cambodia',
      'Camerún': 'Cameroon',
      'Canadá': 'Canada',
      'Chad': 'Chad',
      'Chile': 'Chile',
      'China': 'China',
      'Chipre': 'Cyprus',
      'Ciudad del Vaticano': 'Vatican City',
      'Colombia': 'Colombia',
      'Comores': 'Comoros',
      'Congo': 'Congo',
      'Congo, República Democrática del': 'Democratic Republic of Congo',
      'Corea': 'Korea',
      'Corea del Norte': 'North Korea',
      'Costa de Marfíl': 'Ivory Coast',
      'Costa Rica': 'Costa Rica',
      'Croacia Hrvatska': 'Croatia',
      'Cuba': 'Cuba',
      'Dinamarca': 'Denmark',
      'Djibouti': 'Djibouti',
      'Dominica': 'Dominica',
      'Ecuador': 'Ecuador',
      'Egipto': 'Egypt',
      'El Salvador': 'El Salvador',
      'Emiratos Árabes Unidos': 'United Arab Emirates',
      'Eritrea': 'Eritrea',
      'Eslovenia': 'Slovenia',
      'España': 'Spain',
      'Estados Unidos': 'United States',
      'Estonia': 'Estonia',
      'Etiopía': 'Ethiopia',
      'Fiji': 'Fiji',
      'Filipinas': 'Philippines',
      'Finlandia': 'Finland',
      'Francia': 'France',
      'Gabón': 'Gabon',
      'Gambia': 'Gambia',
      'Georgia': 'Georgia',
      'Ghana': 'Ghana',
      'Gibraltar': 'Gibraltar',
      'Granada': 'Grenada',
      'Grecia': 'Greece',
      'Groenlandia': 'Greenland',
      'Guadalupe': 'Guadeloupe',
      'Guam': 'Guam',
      'Guatemala': 'Guatemala',
      'Guayana': 'Guyana',
      'Guayana Francesa': 'French Guiana',
      'Guinea': 'Guinea',
      'Guinea Ecuatorial': 'Equatorial Guinea',
      'Guinea-Bissau': 'Guinea-Bissau',
      'Haití': 'Haiti',
      'Honduras': 'Honduras',
      'Hungría': 'Hungary',
      'India': 'India',
      'Indonesia': 'Indonesia',
      'Irak': 'Iraq',
      'Irán': 'Iran',
      'Irlanda': 'Ireland',
      'Isla Bouvet': 'Bouvet Island',
      'Isla de Christmas': 'Christmas Island',
      'Islandia': 'Iceland',
      'Islas Caimán': 'Cayman Islands',
      'Islas Cook': 'Cook Islands',
      'Islas de Cocos o Keeling': 'Cocos Islands',
      'Islas Faroe': 'Faroe Islands',
      'Islas Heard y McDonald': 'Heard and McDonald Islands',
      'Islas Malvinas': 'Falkland Islands',
      'Islas Marianas del Norte': 'Northern Mariana Islands',
      'Islas Marshall': 'Marshall Islands',
      'Islas menores de Estados Unidos': 'US Minor Outlying Islands',
      'Islas Palau': 'Palau',
      'Islas Salomón': 'Solomon Islands',
      'Islas Svalbard y Jan Mayen': 'Svalbard and Jan Mayen',
      'Islas Tokelau': 'Tokelau',
      'Islas Turks y Caicos': 'Turks and Caicos Islands',
      'Islas Vírgenes (EEUU)': 'US Virgin Islands',
      'Islas Vírgenes (Reino Unido)': 'British Virgin Islands',
      'Islas Wallis y Futuna': 'Wallis and Futuna',
      'Israel': 'Israel',
      'Italia': 'Italy',
      'Jamaica': 'Jamaica',
      'Japón': 'Japan',
      'Jordania': 'Jordan',
      'Kazajistán': 'Kazakhstan',
      'Kenia': 'Kenya',
      'Kirguizistán': 'Kyrgyzstan',
      'Kiribati': 'Kiribati',
      'Kuwait': 'Kuwait',
      'Laos': 'Laos',
      'Lesotho': 'Lesotho',
      'Letonia': 'Latvia',
      'Líbano': 'Lebanon',
      'Liberia': 'Liberia',
      'Libia': 'Libia',
      'Liechtenstein': 'Liechtenstein',
      'Lituania': 'Lithuania',
      'Luxemburgo': 'Luxembourg',
      'Macedonia, Ex-República Yugoslava de': 'Macedonia',
      'Madagascar': 'Madagascar',
      'Malasia': 'Malaysia',
      'Malawi': 'Malawi',
      'Maldivas': 'Maldives',
      'Malí': 'Mali',
      'Malta': 'Malta',
      'Marruecos': 'Morocco',
      'Martinica': 'Martinique',
      'Mauricio': 'Mauritius',
      'Mauritania': 'Mauritania',
      'Mayotte': 'Mayotte',
      'México': 'Mexico',
      'Micronesia': 'Micronesia',
      'Moldavia': 'Moldova',
      'Mónaco': 'Monaco',
      'Mongolia': 'Mongolia',
      'Montserrat': 'Montserrat',
      'Mozambique': 'Mozambique',
      'Namibia': 'Namibia',
      'Nauru': 'Nauru',
      'Nepal': 'Nepal',
      'Nicaragua': 'Nicaragua',
      'Níger': 'Niger',
      'Nigeria': 'Nigeria',
      'Niue': 'Niue',
      'Norfolk': 'Norfolk Island',
      'Noruega': 'Norway',
      'Nueva Caledonia': 'New Caledonia',
      'Nueva Zelanda': 'New Zealand',
      'Omán': 'Oman',
      'Países Bajos': 'Netherlands',
      'Panamá': 'Panama',
      'Papúa Nueva Guinea': 'Papua New Guinea',
      'Paquistán': 'Pakistan',
      'Paraguay': 'Paraguay',
      'Perú': 'Peru',
      'Pitcairn': 'Pitcairn',
      'Polinesia Francesa': 'French Polynesia',
      'Polonia': 'Poland',
      'Portugal': 'Portugal',
      'Puerto Rico': 'Puerto Rico',
      'Qatar': 'Qatar',
      'Reino Unido': 'United Kingdom',
      'República Centroafricana': 'Central African Republic',
      'República Checa': 'Czech Republic',
      'República de Sudáfrica': 'South Africa',
      'República Dominicana': 'Dominican Republic',
      'República Eslovaca': 'Slovakia',
      'Reunión': 'Reunion',
      'Ruanda': 'Rwanda',
      'Rumania': 'Romania',
      'Rusia': 'Russia',
      'Sahara Occidental': 'Western Sahara',
      'Saint Kitts y Nevis': 'Saint Kitts and Nevis',
      'Samoa': 'Samoa',
      'Samoa Americana': 'American Samoa',
      'San Marino': 'San Marino',
      'San Vicente y Granadinas': 'Saint Vincent and Grenadines',
      'Santa Helena': 'Saint Helena',
      'Santa Lucía': 'Saint Lucia',
      'Santo Tomé y Príncipe': 'Sao Tome and Principe',
      'Senegal': 'Senegal',
      'Seychelles': 'Seychelles',
      'Sierra Leona': 'Sierra Leone',
      'Singapur': 'Singapore',
      'Siria': 'Syria',
      'Somalia': 'Somalia',
      'Sri Lanka': 'Sri Lanka',
      'St Pierre y Miquelon': 'Saint Pierre and Miquelon',
      'Suazilandia': 'Swaziland',
      'Sudán': 'Sudan',
      'Suecia': 'Sweden',
      'Suiza': 'Switzerland',
      'Surinam': 'Suriname',
      'Tailandia': 'Thailand',
      'Taiwán': 'Taiwan',
      'Tanzania': 'Tanzania',
      'Tayikistán': 'Tajikistan',
      'Territorios franceses del Sur': 'French Southern Territories',
      'Timor Oriental': 'East Timor',
      'Togo': 'Togo',
      'Tonga': 'Tonga',
      'Trinidad y Tobago': 'Trinidad and Tobago',
      'Túnez': 'Tunisia',
      'Turkmenistán': 'Turkmenistan',
      'Turquía': 'Turkey',
      'Tuvalu': 'Tuvalu',
      'Ucrania': 'Ukraine',
      'Uganda': 'Uganda',
      'Uruguay': 'Uruguay',
      'Uzbekistán': 'Uzbekistan',
      'Vanuatu': 'Vanuatu',
      'Venezuela': 'Venezuela',
      'Vietnam': 'Vietnam',
      'Yemen': 'Yemen',
      'Yugoslavia': 'Yugoslavia',
      'Zambia': 'Zambia',
      'Zimbabue': 'Zimbabwe'
    },
    
    // Opciones de depósito
    depositos: {
      '': 'Select',
      '50%': '50%',
      '100%': '100%'
    },
    
    // Opciones de extras (traducidas al inglés)
    extrasOptions: {
      '1': 'No',
      'Tabla de fiambres': 'Charcuterie Board',
      'Tabla de fresas': 'Strawberry Board',
      'Tabla de fiambres + vino': 'Charcuterie Board + Wine',
      'Vino': 'Wine',
      'Decoración pétalos': 'Petal Decoration',
      'Globos': 'Balloons',
      'Propuesta de matrimonio/ noviazgo': 'Marriage/Relationship Proposal'
    },
    
    // Opciones de mascotas
    mascotasOptions: {
      '': 'Select',
      'Si': 'Yes',
      'No': 'No'
    },
    
    // Mensajes de disponibilidad
    availabilityMessages: {
      available: '✅ Dates available',
      notAvailable: '❌ Dates not available',
      checking: '⏳ Checking availability...'
    }
  }
}

/**
 * Genera las opciones de países para el select
 * @param {Object} paises - Objeto de países del idioma actual
 * @returns {Array} Array de elementos option para el select
 */
export const generateCountryOptions = (paises) => {
  return Object.entries(paises).map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
  ))
}

/**
 * Genera las opciones de cabañas para el select
 * @param {Object} cabins - Objeto de cabañas del idioma actual
 * @returns {Array} Array de elementos option para el select
 */
export const generateCabinOptions = (cabins) => {
  return Object.entries(cabins).map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
  ))
}

/**
 * Genera las opciones de personas para el select
 * @param {Object} personas - Objeto de personas del idioma actual
 * @param {string} selectedCabin - Cabaña seleccionada
 * @param {string} language - Idioma actual
 * @returns {Array} Array de elementos option para el select
 */
export const generatePersonOptions = (personas, selectedCabin = '', language = 'es') => {
  // Si la cabaña seleccionada es Colima (6), mostrar opciones especiales
  if (selectedCabin === '6') {
    const colimaOptions = [
      { value: '', label: language === 'es' ? 'Cantidad personas' : 'Number of people' },
      { value: '1', label: '1 persona / 1 person' },
      { value: '2', label: '2 personas / 2 people' },
      { value: '3', label: '3 personas / 3 people' },
      { value: '4', label: '4 personas / 4 people' },
      { value: '5', label: '5 personas / 5 people' },
      { value: '6', label: '6 personas / 6 people' },
      { value: '7', label: '7 personas / 7 people' },
      { value: '8', label: '8 personas / 8 people' }
    ]
    
    return colimaOptions.map((option) => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))
  }
  
  // Para todas las otras cabañas, usar las opciones normales
  return Object.entries(personas).map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
  ))
}

/**
 * Genera las opciones de depósito para el select
 * @param {Object} depositos - Objeto de depósitos del idioma actual
 * @returns {Array} Array de elementos option para el select
 */
export const generateDepositOptions = (depositos) => {
  return Object.entries(depositos).map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
  ))
}

/**
 * Genera las opciones de extras para el select múltiple
 * @param {Object} extrasOptions - Objeto de extras del idioma actual
 * @returns {Array} Array de elementos option para el select múltiple
 */
export const generateExtrasOptions = (extrasOptions) => {
  return Object.entries(extrasOptions).map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
  ))
}

/**
 * Genera las opciones de mascotas para el select
 * @param {Object} mascotasOptions - Objeto de mascotas del idioma actual
 * @returns {Array} Array de elementos option para el select
 */
export const generatePetsOptions = (mascotasOptions) => {
  return Object.entries(mascotasOptions).map(([value, label]) => (
    <option key={value} value={value}>{label}</option>
  ))
}

/**
 * Valida el formato de email usando el patrón especificado
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido, false si no
 */
export const validateEmail = (email) => {
  const pattern = /^[.a-zA-Z0-9_]+([.][.a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/
  return pattern.test(email)
}

/**
 * Obtiene el mensaje de validación de email según el estado
 * @param {string} email - Email a validar
 * @param {string} language - Idioma actual
 * @returns {Object} Objeto con mensaje y clase CSS
 */
export const getEmailValidationMessage = (email, language = 'es') => {
  if (!email) {
    return { message: '', className: '' }
  }
  
  const isValid = validateEmail(email)
  
  if (isValid) {
    return {
      message: language === 'es' ? 'Formato de correo válido' : 'Valid email format',
      className: 'email-valid'
    }
  } else {
    return {
      message: language === 'es' ? 'El formato del correo no es válido' : 'Email format is not valid',
      className: 'email-invalid'
    }
  }
}

/**
 * Valida la disponibilidad de fechas llamando al endpoint de la API
 * @param {string} cabanaId - ID de la cabaña
 * @param {Object|string} fechaIngreso - Fecha de ingreso (dayjs object o string)
 * @param {Object|string} fechaSalida - Fecha de salida (dayjs object o string)
 * @returns {Promise<Object>} Resultado de la validación
 */
export const validateDateAvailability = async (cabanaId, fechaIngreso, fechaSalida) => {
  try {
    // Convertir fechas a string si son objetos dayjs
    let fechaIngresoString = ''
    let fechaSalidaString = ''
    
    if (typeof fechaIngreso === 'string') {
      fechaIngresoString = fechaIngreso
    } else if (fechaIngreso && typeof fechaIngreso.format === 'function') {
      fechaIngresoString = fechaIngreso.format('YYYY-MM-DD')
    } else if (fechaIngreso && fechaIngreso.isValid && fechaIngreso.isValid()) {
      fechaIngresoString = fechaIngreso.format('YYYY-MM-DD')
    }
    
    if (typeof fechaSalida === 'string') {
      fechaSalidaString = fechaSalida
    } else if (fechaSalida && typeof fechaSalida.format === 'function') {
      fechaSalidaString = fechaSalida.format('YYYY-MM-DD')
    } else if (fechaSalida && fechaSalida.isValid && fechaSalida.isValid()) {
      fechaSalidaString = fechaSalida.format('YYYY-MM-DD')
    }
    
    // Validar que tengamos las fechas
    if (!fechaIngresoString || !fechaSalidaString) {
      return {
        success: false,
        available: false,
        message: 'Fechas inválidas para validación'
      }
    }
    
    // URL del endpoint de validación
    const endpointURL = 'https://apimagia.magiadelpoas.com/api/landing/validate-availability'
    
    // Datos a enviar
    const requestData = {
      cabanaId: cabanaId,
      fechaIngreso: fechaIngresoString,
      fechaSalida: fechaSalidaString
    }
    
    
    // Llamar al endpoint
    const response = await fetch(endpointURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    
    // Verificar si la respuesta es JSON válido
    let result
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      // Si no es JSON, crear un objeto de error
      const textResponse = await response.text()
      result = {
        success: false,
        available: false,
        message: 'Error del servidor: respuesta inválida'
      }
    }
    
    // Para validación de disponibilidad:
    // - 200 = Fechas disponibles (success: true)
    // - 409 = Fechas no disponibles (success: true, pero available: false)
    // - Otros códigos = Error real del sistema
    
    const isAvailabilityResponse = response.status === 200 || response.status === 409
    
    const finalResult = {
      success: isAvailabilityResponse,
      available: Boolean(result.data?.available || result.available),
      message: result.message || 'Error al validar disponibilidad',
      conflicts: result.conflicts || null
    }
    
    
    return finalResult
    
  } catch (error) {
    
    return {
      success: false,
      available: false,
      message: 'Error de conexión al validar disponibilidad'
    }
  }
}

/**
 * Valida que todos los campos obligatorios estén llenos
 * @param {Object} formData - Datos del formulario
 * @param {string} language - Idioma actual
 * @returns {Object} Objeto con validación y mensajes
 */
export const validateRequiredFields = (formData, language = 'es') => {
  const requiredFields = {
    cabana: { label: language === 'es' ? 'Cabaña' : 'Cabin', type: 'select' },
    fullname: { label: language === 'es' ? 'Nombre Completo' : 'Full Name', type: 'input' },
    email: { label: language === 'es' ? 'Correo Electrónico' : 'Email', type: 'input' },
    currency: { label: language === 'es' ? 'Moneda' : 'Currency', type: 'select' },
    totalDepositado: { label: language === 'es' ? 'Total Depositado' : 'Total Deposit', type: 'input' },
    fechaIngreso: { label: language === 'es' ? 'Fecha de Ingreso' : 'Check In', type: 'date' },
    fechaSalida: { label: language === 'es' ? 'Fecha de Salida' : 'Check Out', type: 'date' },
    cantidadPersonas: { label: language === 'es' ? 'Cantidad de Personas' : 'Number of People', type: 'select' },
    pais: { label: language === 'es' ? 'País' : 'Country', type: 'select' },
    deposito: { label: language === 'es' ? 'Depósito %' : 'Deposit %', type: 'select' },
    extras: { label: language === 'es' ? 'Extras' : 'Extras', type: 'select' },
    mascotas: { label: language === 'es' ? 'Mascotas' : 'Pets', type: 'select' },
    proofOfAddress: { label: language === 'es' ? 'Comprobante de Pago 1' : 'Payment Receipt 1', type: 'file' },
    declaration: { label: language === 'es' ? 'Declaración' : 'Declaration', type: 'checkbox' }
  }

  const missingFields = []
  const missingFieldNames = []

  // Validar campos obligatorios
  for (const [field, fieldInfo] of Object.entries(requiredFields)) {
    if (field === 'extras') {
      // Extras puede estar vacío
      continue
    } else if (field === 'proofOfAddress2') {
      // Comprobante de Pago 2 es opcional
      continue
    } else if (field === 'declaration') {
      // Validar checkbox de declaración
      if (!formData[field]) {
        missingFields.push(fieldInfo.label)
        missingFieldNames.push(field)
      }
    } else if (field === 'fechaIngreso' || field === 'fechaSalida') {
      // Validar fechas (objetos dayjs)
      if (!formData[field] || !formData[field].isValid()) {
        missingFields.push(fieldInfo.label)
        missingFieldNames.push(field)
      }
    } else if (field === 'proofOfAddress') {
      // Validar archivo
      if (!formData[field]) {
        missingFields.push(fieldInfo.label)
        missingFieldNames.push(field)
      }
    } else {
      // Validar campos de texto y select
      if (!formData[field] || formData[field].toString().trim() === '') {
        missingFields.push(fieldInfo.label)
        missingFieldNames.push(field)
      }
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    missingFieldNames
  }
}
