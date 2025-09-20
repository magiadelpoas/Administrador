import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Get language from localStorage or default to Spanish
  const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    return savedLanguage || 'es'
  }

  const [language, setLanguage] = useState(getInitialLanguage)
  const [formData, setFormData] = useState({
    cabana: '',
    fullname: '',
    email: '',
    phone: '',
    currency: '₡ ',
    totalDepositado: '',
    fechaIngreso: '',
    fechaSalida: '',
    proofOfAddress: null,
    declaration: false
  })

  const translations = {
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
      proofOfAddress: 'Documento de Identificación (Opcional)',
      declaration: 'Confirmo que la información proporcionada es precisa y completa.',
      submitButton: 'Enviar Reservación',
      placeholders: {
        fullName: 'Ingrese su nombre completo',
        email: 'Ingrese su correo electrónico',
        phone: 'Ingrese su número de teléfono'
      },
      cabins: {
        '': 'Click Aquí',
        '1': '1 .Estándar - ANTÍA',
        '2': '2 .Estándar - LILLIAM',
        '3': '3 .Deluxe - LUNA',
        '4': '4 .Deluxe - ROBLE ESCONDIDO',
        '5': '5 .Glamping',
        '6': '6 .Colima'
      },
      currencies: {
        '₡ ': '₡ Colones',
        '$ ': '$ Dólares'
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
      proofOfAddress: 'Identification Document (Optional)',
      declaration: 'I confirm that the information provided is accurate and complete.',
      submitButton: 'Submit Reservation',
      placeholders: {
        fullName: 'Enter your full name',
        email: 'Enter your email',
        phone: 'Enter your phone number'
      },
      cabins: {
        '': 'Click Here',
        '1': '1 .Standard - ANTÍA',
        '2': '2 .Standard - LILLIAM',
        '3': '3 .Deluxe - LUNA',
        '4': '4 .Deluxe - ROBLE ESCONDIDO',
        '5': '5 .Glamping',
        '6': '6 .Colima'
      },
      currencies: {
        '₡ ': '₡ Colones',
        '$ ': '$ Dollars'
      }
    }
  }

  const t = translations[language]

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your form submission logic here
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    setLanguage(newLanguage)
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', newLanguage)
  }

  const styles = {
    mainCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: '"Inter", sans-serif',
      backgroundColor: '#f3f4f6',
      margin: 0
    },
    formContainer: {
      margin: '0 auto',
      maxWidth: '570px',
      width: '100%',
      background: 'white',
      padding: '2.5rem',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    },
    formImg: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '2rem',
      width: '100%',
      maxWidth: '200px',
      height: 'auto'
    },
    formTitle: {
      fontSize: '1.875rem',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '0.5rem',
      textAlign: 'center'
    },
    formDesc: {
      color: '#6b7280',
      marginBottom: '2rem',
      fontSize: '0.875rem',
      textAlign: 'center',
      lineHeight: 1.5
    },
    formLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151'
    },
    formInput: {
      width: '100%',
      padding: '0.875rem 1.25rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      background: '#ffffff',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '1.25rem',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    formDateInput: {
      width: '100%',
      padding: '0.875rem 3rem 0.875rem 1.25rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      background: '#ffffff',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '1.25rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      position: 'relative',
      cursor: 'text',
      minHeight: '48px'
    },
    formSelect: {
      width: '100%',
      padding: '0.875rem 1.25rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      background: '#ffffff',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '1.25rem',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    formFile: {
      display: 'block',
      width: '100%',
      marginBottom: '1.25rem',
      fontSize: '0.875rem',
      color: '#374151'
    },
    formCheckboxRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      marginTop: '1.5rem',
      marginBottom: '1.5rem'
    },
    formCheckbox: {
      marginTop: '0.125rem',
      height: '1.25rem',
      width: '1.25rem',
      borderRadius: '0.25rem',
      border: '1px solid #d1d5db',
      cursor: 'pointer',
      flexShrink: 0
    },
    checkboxLabel: {
      margin: 0,
      fontWeight: 500,
      fontSize: '0.875rem',
      color: '#374151'
    },
    formBtn: {
      textAlign: 'center',
      width: '100%',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      padding: '0.875rem 1.5rem',
      border: 'none',
      fontWeight: 600,
      backgroundColor: '#6a64f1',
      color: 'white',
      cursor: 'pointer',
      marginTop: '1.5rem',
      transition: 'background-color 0.2s, box-shadow 0.2s'
    },
    headerDiv: {
      marginBottom: '2rem'
    },
    languageButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      width: '60px',
      height: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      fontSize: '12px',
      zIndex: 1000,
      gap: '2px'
    },
    flagContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    flag: {
      width: '24px',
      height: '16px',
      objectFit: 'cover',
      borderRadius: '2px',
      display: 'block'
    },
    languageText: {
      fontSize: '10px',
      fontWeight: 'bold',
      color: '#374151',
      lineHeight: 1,
      marginTop: '2px'
    }
  }

  return (
    <div style={styles.mainCenter}>
      <div style={styles.formContainer}>
        {/* Language Toggle Button */}
        <button 
          onClick={toggleLanguage}
          style={styles.languageButton}
          title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <div style={styles.flagContainer}>
            <img 
              src={language === 'es' ? "/assets/estados.png" : "/assets/espana.png"}
              alt={language === 'es' ? 'US Flag' : 'Spain Flag'}
              style={styles.flag}
            />
          </div>
          <span style={styles.languageText}>
            {language === 'es' ? 'EN' : 'ES'}
          </span>
        </button>

        <img
          src="/assets/logo.jpg"
            alt="Address Form Image"
          style={styles.formImg}
        />
        <form onSubmit={handleSubmit}>
          <div style={styles.headerDiv}>
            <h2 style={styles.formTitle}>{t.formTitle}</h2>
            <p style={styles.formDesc}>
              {t.formDesc}
                </p>
            </div>

          <label htmlFor="cabana" style={styles.formLabel}>{t.selectCabin}</label>
          <select 
            name="cabana" 
            id="cabana" 
            style={styles.formSelect} 
            value={formData.cabana}
            onChange={handleInputChange}
            required
          >
            <option value="">{t.cabins['']}</option>
            <option value="1">{t.cabins['1']}</option>
            <option value="2">{t.cabins['2']}</option>
            <option value="3">{t.cabins['3']}</option>
            <option value="4">{t.cabins['4']}</option>
            <option value="5">{t.cabins['5']}</option>
            <option value="6">{t.cabins['6']}</option>
          </select>

          <label htmlFor="fullname" style={styles.formLabel}>{t.fullName}</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            style={styles.formInput}
            placeholder={t.placeholders.fullName}
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="email" style={styles.formLabel}>{t.email}</label>
            <input
                type="email"
                name="email"
                id="email"
            style={styles.formInput}
            placeholder={t.placeholders.email}
            value={formData.email}
            onChange={handleInputChange}
                required
            />

          <label htmlFor="phone" style={styles.formLabel}>
            {t.phone}
          </label>
            <input
                type="tel"
                name="phone"
                id="phone"
            style={styles.formInput}
            placeholder={t.placeholders.phone}
            value={formData.phone}
            onChange={handleInputChange}
          />

          <label htmlFor="currency" style={styles.formLabel}>{t.currency}</label>
          <select 
            name="currency"
            id="currency" 
            style={styles.formSelect} 
            value={formData.currency}
            onChange={handleInputChange}
            required
          >
            <option value="Colones">{t.currencies['₡ ']}</option>
            <option value="Dólares">{t.currencies['$ ']}</option>
          </select>

          <label htmlFor="totalDepositado" style={styles.formLabel}>{t.totalDepositado}</label>
          <input
            type="number"
            name="totalDepositado"
            id="totalDepositado"
            style={styles.formInput}
            placeholder="0"
            value={formData.totalDepositado}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="fechaIngreso" style={styles.formLabel}>{t.fechaIngreso}</label>
          <input
            type="date"
            name="fechaIngreso"
            id="fechaIngreso"
            style={styles.formDateInput}
            value={formData.fechaIngreso}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="fechaSalida" style={styles.formLabel}>{t.fechaSalida}</label>
          <input
            type="date"
            name="fechaSalida"
            id="fechaSalida"
            style={styles.formDateInput}
            value={formData.fechaSalida}
            onChange={handleInputChange}
            required
          />


          <label htmlFor="proofOfAddress" style={styles.formLabel}>
            {t.proofOfAddress}
          </label>
            <input
                type="file"
            name="proofOfAddress"
            id="proofOfAddress"
                accept=".pdf,.jpg,.jpeg,.png"
            style={styles.formFile}
            onChange={handleInputChange}
            />

          <div style={styles.formCheckboxRow}>
                <input
                    type="checkbox"
              name="declaration"
                    id="declaration"
              style={styles.formCheckbox}
              checked={formData.declaration}
              onChange={handleInputChange}
                    required
                />
                <label
              htmlFor="declaration"
              style={styles.checkboxLabel}
                >
              {t.declaration}
                </label>
            </div>

          <button type="submit" style={styles.formBtn}>{t.submitButton}</button>
        </form>
    </div>
</div>
  )
}

export default App