import { useState, useEffect } from 'react'
import './App.css'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  IconButton
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'

// Styled components to maintain current design
const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: '570px',
  width: '100%',
  padding: '2.5rem',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  backgroundColor: 'white'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
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
    color: '#374151',
    marginBottom: '0.5rem'
  }
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  padding: '0.875rem 1.5rem',
  fontWeight: 600,
  backgroundColor: '#6a64f1',
  marginTop: '1.5rem',
  '&:hover': {
    backgroundColor: '#5a54d1',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
}))

const LanguageButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'white',
  border: '2px solid #d1d5db',
  borderRadius: '8px',
  width: '60px',
  height: '40px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: '#f9fafb'
  }
}))

const FormImage = styled('img')(({ theme }) => ({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '2rem',
  width: '100%',
  maxWidth: '200px',
  height: 'auto'
}))

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
    currency: 'Colones',
    totalDepositado: '',
    fechaIngreso: null,
    fechaSalida: null,
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
        'Colones': '₡ Colones',
        'Dólares': '$ Dólares'
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
        'Colones': '₡ Colones',
        'Dólares': '$ Dollars'
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

  const handleSelectChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
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


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: '#f3f4f6',
          fontFamily: '"Inter", sans-serif'
        }}
      >
      <StyledPaper elevation={3}>
        {/* Language Toggle Button */}
        <LanguageButton
          onClick={toggleLanguage}
          title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <img 
              src={language === 'es' ? "/assets/estados.png" : "/assets/espana.png"}
              alt={language === 'es' ? 'US Flag' : 'Spain Flag'}
              style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }}
            />
            <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 'bold', color: '#374151' }}>
              {language === 'es' ? 'EN' : 'ES'}
            </Typography>
          </Box>
        </LanguageButton>

        <FormImage src="/assets/logo.jpg" alt="Reservation Form Image" />

        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: '2rem', textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ 
              fontSize: '1.875rem', 
              fontWeight: 700, 
              color: '#111827', 
              marginBottom: '0.5rem' 
            }}>
              {t.formTitle}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              lineHeight: 1.5 
            }}>
              {t.formDesc}
            </Typography>
          </Box>

          <StyledFormControl>
            <InputLabel>{t.selectCabin}</InputLabel>
            <Select
              name="cabana"
              value={formData.cabana}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="">{t.cabins['']}</MenuItem>
              <MenuItem value="1">{t.cabins['1']}</MenuItem>
              <MenuItem value="2">{t.cabins['2']}</MenuItem>
              <MenuItem value="3">{t.cabins['3']}</MenuItem>
              <MenuItem value="4">{t.cabins['4']}</MenuItem>
              <MenuItem value="5">{t.cabins['5']}</MenuItem>
              <MenuItem value="6">{t.cabins['6']}</MenuItem>
            </Select>
          </StyledFormControl>

          <StyledTextField
            name="fullname"
            label={t.fullName}
            placeholder={t.placeholders.fullName}
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />

          <StyledTextField
            name="email"
            type="email"
            label={t.email}
            placeholder={t.placeholders.email}
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <StyledTextField
            name="phone"
            type="tel"
            label={t.phone}
            placeholder={t.placeholders.phone}
            value={formData.phone}
            onChange={handleInputChange}
          />

          <StyledFormControl>
            <InputLabel>{t.currency}</InputLabel>
            <Select
              name="currency"
              value={formData.currency}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="Colones">{t.currencies['Colones']}</MenuItem>
              <MenuItem value="Dólares">{t.currencies['Dólares']}</MenuItem>
            </Select>
          </StyledFormControl>

          <StyledTextField
            name="totalDepositado"
            type="number"
            label={t.totalDepositado}
            placeholder="0"
            value={formData.totalDepositado}
            onChange={handleInputChange}
            required
          />

          <StyledDatePicker
            label={t.fechaIngreso}
            value={formData.fechaIngreso}
            onChange={(date) => handleDateChange('fechaIngreso', date)}
            slotProps={{
              textField: {
                required: true,
              },
            }}
          />

          <StyledDatePicker
            label={t.fechaSalida}
            value={formData.fechaSalida}
            onChange={(date) => handleDateChange('fechaSalida', date)}
            slotProps={{
              textField: {
                required: true,
              },
            }}
          />

          <StyledTextField
            name="proofOfAddress"
            type="file"
            label={t.proofOfAddress}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              accept: '.pdf,.jpg,.jpeg,.png'
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="declaration"
                checked={formData.declaration}
                onChange={handleInputChange}
                required
                sx={{
                  '&.Mui-checked': {
                    color: '#6a64f1',
                  },
                }}
              />
            }
            label={t.declaration}
            sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}
          />

          <StyledButton type="submit" variant="contained">
            {t.submitButton}
          </StyledButton>
        </form>
      </StyledPaper>
    </Container>
    </LocalizationProvider>
  )
}

export default App