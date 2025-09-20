/**
 * App.jsx - Componente principal del formulario de reservación
 * Formulario bilingüe (Español/Inglés) para reservaciones de cabañas
 * Utiliza Material-UI para campos de fecha y archivo, HTML nativo para el resto
 */

import React, { useState, useEffect } from 'react'
import './App.css'

// Imports de Material-UI para DatePicker y componentes de archivo
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'
import { CloudUpload } from '@mui/icons-material'

// Import de SweetAlert2 para validaciones
import Swal from 'sweetalert2'

// Imports de funciones utilitarias centralizadas
import {
  getInitialLanguage,
  toggleLanguage,
  handleInputChange,
  handleDateChange,
  handleFileChange,
  handleSubmit,
  initialFormData,
  translations,
  generateCabinOptions,
  generatePersonOptions,
  generateCountryOptions,
  generateDepositOptions,
  generateExtrasOptions,
  generatePetsOptions
} from './Utils.jsx'


/**
 * Componente styled para DatePicker de Material-UI
 * Mantiene consistencia visual con el resto del formulario
 */
const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  marginBottom: '1.25rem',
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    '& fieldset': {
      borderColor: '#d1d5db'
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6a64f1',
      boxShadow: '0 0 0 3px rgba(106, 100, 241, 0.2)'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151'
  }
}))

/**
 * Componente styled para campos de archivo de Material-UI
 * Proporciona una interfaz moderna para la subida de archivos
 */
const StyledFileUpload = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: '1.25rem',
  '& .file-input': {
    display: 'none'
  },
  '& .file-button': {
    width: '100%',
    padding: '0.875rem 1.25rem',
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#374151',
    '&:hover': {
      borderColor: '#6a64f1',
      backgroundColor: '#f9fafb'
    }
  },
  '& .file-selected': {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    color: '#065f46'
  },
  '& .file-icon': {
    marginRight: '0.5rem'
  }
}))

/**
 * Estilos movidos a App.css
 * Todos los estilos inline han sido convertidos a clases CSS
 */

/**
 * Componente principal App
 * Maneja el estado del formulario y la lógica de traducción
 */
function App() {
  // Estado del idioma actual
  const [language, setLanguage] = useState(getInitialLanguage)
  
  // Estado de los datos del formulario
  const [formData, setFormData] = useState(initialFormData)

  // Objeto de traducciones para el idioma actual
  const t = translations[language]

  // Carga la preferencia de idioma guardada al montar el componente
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  /**
   * Wrapper para handleInputChange que actualiza el estado
   * @param {Event} e - Evento del input
   */
  const onInputChange = (e) => {
    setFormData(prev => handleInputChange(e, prev))
  }

  /**
   * Wrapper para handleDateChange que actualiza el estado
   * @param {string} name - Nombre del campo de fecha
   * @param {Object} date - Objeto de fecha de dayjs
   */
  const onDateChange = (name, date) => {
    // Validar inmediatamente cuando se selecciona una fecha
    if (date && name === 'fechaSalida' && formData.fechaIngreso) {
      if (date.isBefore(formData.fechaIngreso, 'day')) {
        // Mostrar error según el idioma
        const errorMessage = language === 'es' 
          ? 'La fecha de salida no puede ser menor que la fecha de entrada'
          : 'The departure date cannot be earlier than the arrival date'
        
        Swal.fire({
          icon: 'error',
          title: language === 'es' ? 'Error de Fechas' : 'Date Error',
          text: errorMessage,
          confirmButtonText: language === 'es' ? 'Entendido' : 'OK'
        })
        
        // No actualizar el estado si hay error
        return
      }
    }

    // Validar también cuando se cambia la fecha de ingreso
    if (date && name === 'fechaIngreso' && formData.fechaSalida) {
      if (formData.fechaSalida.isBefore(date, 'day')) {
        // Mostrar error según el idioma
        const errorMessage = language === 'es' 
          ? 'La fecha de salida no puede ser menor que la fecha de entrada'
          : 'The departure date cannot be earlier than the arrival date'
        
        Swal.fire({
          icon: 'error',
          title: language === 'es' ? 'Error de Fechas' : 'Date Error',
          text: errorMessage,
          confirmButtonText: language === 'es' ? 'Entendido' : 'OK'
        })
        
        // No actualizar el estado si hay error
        return
      }
    }

    // Actualizar el estado normalmente si no hay errores
    setFormData(prev => handleDateChange(name, date, prev, language))
  }

  /**
   * Wrapper para handleFileChange que actualiza el estado
   * @param {Event} e - Evento del input de archivo
   */
  const onFileChange = (e) => {
    setFormData(prev => handleFileChange(e, prev))
  }

  /**
   * Wrapper para handleSubmit que maneja el envío
   * @param {Event} e - Evento de envío del formulario
   */
  const onSubmit = (e) => {
    handleSubmit(e, formData)
  }

  /**
   * Maneja el cambio de idioma
   */
  const onLanguageToggle = () => {
    const newLanguage = toggleLanguage(language)
    setLanguage(newLanguage)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="main-center">
        <div className="form-container">
          {/* Botón de cambio de idioma */}
          <button 
            onClick={onLanguageToggle}
            className="language-button"
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <div className="flag-container">
              <img 
                src={language === 'es' ? "/assets/estados.png" : "/assets/espana.png"}
                alt={language === 'es' ? 'US Flag' : 'Spain Flag'}
                className="flag"
              />
            </div>
            <span className="language-text">
              {language === 'es' ? 'EN' : 'ES'}
            </span>
          </button>

          {/* Logo */}
          <img
            src="/assets/logo.jpg"
            alt="Logo"
            className="form-img"
          />
          
          {/* Formulario */}
          <form onSubmit={onSubmit}>
            {/* Header del formulario */}
            <div className="header-div">
              <h2 className="form-title">{t.formTitle}</h2>
              <p className="form-desc">
                {t.formDesc}
                </p>
            </div>

            {/* Campo: Selección de Cabaña */}
            <label htmlFor="cabana" className="form-label">{t.selectCabin}</label>
            <select 
              name="cabana" 
              id="cabana" 
              className="form-select" 
              value={formData.cabana}
              onChange={onInputChange}
              required
            >
              {generateCabinOptions(t.cabins)}
            </select>

            {/* Campo: Nombre Completo */}
            <label htmlFor="fullname" className="form-label">{t.fullName}</label>
            <input
                type="text"
                name="fullname"
                id="fullname"
              className="form-input"
              placeholder={t.placeholders.fullName}
              value={formData.fullname}
              onChange={onInputChange}
                required
            />

            {/* Campo: Email */}
            <label htmlFor="email" className="form-label">{t.email}</label>
            <input
                type="email"
                name="email"
                id="email"
              className="form-input"
              placeholder={t.placeholders.email}
              value={formData.email}
              onChange={onInputChange}
                required
            />

            {/* Campo: Teléfono */}
            <label htmlFor="phone" className="form-label">
              {t.phone}
            </label>
            <input
                type="tel"
                name="phone"
                id="phone"
              className="form-input"
              placeholder={t.placeholders.phone}
              value={formData.phone}
              onChange={onInputChange}
            />

            {/* Campo: Moneda */}
            <label htmlFor="currency" className="form-label">{t.currency}</label>
            <select 
              name="currency"
              id="currency" 
              className="form-select" 
              value={formData.currency}
              onChange={onInputChange}
              required
            >
              <option value="Colones">{t.currencies['Colones']}</option>
              <option value="Dólares">{t.currencies['Dólares']}</option>
            </select>

            {/* Campo: Total Depositado */}
            <label htmlFor="totalDepositado" className="form-label">{t.totalDepositado}</label>
            <input
              type="number"
              name="totalDepositado"
              id="totalDepositado"
              className="form-input"
              placeholder="0"
              value={formData.totalDepositado}
              onChange={onInputChange}
                required
            />

            {/* Campo: Fecha de Ingreso (Material-UI DatePicker) */}
            <StyledDatePicker
              label={t.fechaIngreso}
              value={formData.fechaIngreso}
              onChange={(date) => onDateChange('fechaIngreso', date)}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />

            {/* Campo: Fecha de Salida (Material-UI DatePicker) */}
            <StyledDatePicker
              label={t.fechaSalida}
              value={formData.fechaSalida}
              onChange={(date) => onDateChange('fechaSalida', date)}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />

            {/* Campo: Cantidad de Personas */}
            <label htmlFor="cantidadPersonas" className="form-label">{t.cantidadPersonas}</label>
            <select 
              name="cantidadPersonas"
              id="cantidadPersonas" 
              className="form-select" 
              value={formData.cantidadPersonas}
              onChange={onInputChange}
                required
            >
              {generatePersonOptions(t.personas)}
            </select>

            {/* Campo: País */}
            <label htmlFor="pais" className="form-label">{t.pais}</label>
            <select 
              name="pais"
              id="pais" 
              className="form-select" 
              value={formData.pais}
              onChange={onInputChange}
                required
            >
              {generateCountryOptions(t.paises)}
            </select>

            {/* Campo: Depósito % */}
            <label htmlFor="deposito" className="form-label">{t.deposito}</label>
            <select 
              name="deposito"
              id="deposito" 
              className="form-select" 
              value={formData.deposito}
              onChange={onInputChange}
              required
            >
              {generateDepositOptions(t.depositos)}
            </select>

            {/* Campo: Extras (Select Múltiple) */}
            <label htmlFor="extras" className="form-label">{t.extras}</label>
            <select 
              name="extras"
              id="extras" 
              className="form-select" 
              value={formData.extras}
              onChange={onInputChange}
              multiple
              required
            >
              {generateExtrasOptions(t.extrasOptions)}
            </select>

            {/* Campo: Mascotas */}
            <label htmlFor="mascotas" className="form-label">{t.mascotasLabel}</label>
            <select 
              name="mascotas"
              id="mascotas" 
              className="form-select" 
              value={formData.mascotas}
              onChange={onInputChange}
              required
            >
              {generatePetsOptions(t.mascotasOptions)}
            </select>

            {/* Campo: Comprobante de Pago 1 (Material-UI) */}
            <label htmlFor="proofOfAddress" className="form-label">
              {t.proofOfAddress}
            </label>
            <StyledFileUpload>
            <input
                type="file"
                id="proofOfAddress"
                name="proofOfAddress"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={onFileChange}
                className="file-input"
              />
              <label htmlFor="proofOfAddress" className={`file-button ${formData.proofOfAddress ? 'file-selected' : ''}`}>
                <CloudUpload className="file-icon" />
                {formData.proofOfAddress 
                  ? (language === 'es' ? `Archivo seleccionado: ${formData.proofOfAddress.name}` : `File selected: ${formData.proofOfAddress.name}`)
                  : (language === 'es' ? 'Hacer clic para seleccionar archivo' : 'Click to select file')
                }
              </label>
            </StyledFileUpload>

            {/* Campo: Comprobante de Pago 2 (Material-UI) */}
            <label htmlFor="proofOfAddress2" className="form-label">
              {t.proofOfAddress2}
            </label>
            <StyledFileUpload>
              <input
                type="file"
                id="proofOfAddress2"
                name="proofOfAddress2"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={onFileChange}
                className="file-input"
              />
              <label htmlFor="proofOfAddress2" className={`file-button ${formData.proofOfAddress2 ? 'file-selected' : ''}`}>
                <CloudUpload className="file-icon" />
                {formData.proofOfAddress2 
                  ? (language === 'es' ? `Archivo seleccionado: ${formData.proofOfAddress2.name}` : `File selected: ${formData.proofOfAddress2.name}`)
                  : (language === 'es' ? 'Hacer clic para seleccionar archivo (Opcional)' : 'Click to select file (Optional)')
                }
              </label>
            </StyledFileUpload>

            {/* Campo: Declaración (Checkbox) */}
            <div className="form-checkbox-row">
                <input
                    type="checkbox"
                name="declaration"
                    id="declaration"
                className="form-checkbox"
                checked={formData.declaration}
                onChange={onInputChange}
                    required
                />
                <label
                htmlFor="declaration"
                className="checkbox-label"
                >
                {t.declaration}
                </label>
            </div>

            {/* Botón de envío */}
            <button type="submit" className="form-btn">{t.submitButton}</button>
        </form>
    </div>
</div>
    </LocalizationProvider>
  )
}

export default App
