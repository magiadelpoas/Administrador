import { useState, useEffect } from 'react'
import './App.css'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { styled } from '@mui/material/styles'


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
    cantidadPersonas: '2',
    pais: 'Costa Rica',
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
      cantidadPersonas: 'Personas',
      pais: 'País',
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
      },
      personas: {
        '': 'Seleccionar',
        '1': '1 persona',
        '2': '2 personas',
        '3': '3 personas',
        '4': '4 personas',
        '5': 'Más de 4 personas'
      },
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
      },
      personas: {
        '': 'Select',
        '1': '1 person',
        '2': '2 people',
        '3': '3 people',
        '4': '4 people',
        '5': 'More than 4 people'
      },
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
        'Libia': 'Libya',
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
              <option value="Colones">{t.currencies['Colones']}</option>
              <option value="Dólares">{t.currencies['Dólares']}</option>
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

            <label htmlFor="cantidadPersonas" style={styles.formLabel}>{t.cantidadPersonas}</label>
            <select 
              name="cantidadPersonas"
              id="cantidadPersonas" 
              style={styles.formSelect} 
              value={formData.cantidadPersonas}
              onChange={handleInputChange}
              required
            >
              <option value="">{t.personas['']}</option>
              <option value="1">{t.personas['1']}</option>
              <option value="2">{t.personas['2']}</option>
              <option value="3">{t.personas['3']}</option>
              <option value="4">{t.personas['4']}</option>
              <option value="5">{t.personas['5']}</option>
            </select>

            <label htmlFor="pais" style={styles.formLabel}>{t.pais}</label>
            <select 
              name="pais"
              id="pais" 
              style={styles.formSelect} 
              value={formData.pais}
              onChange={handleInputChange}
              required
            >
              <option value="No especifica">{t.paises['No especifica']}</option>
              <option value="Afganistán">{t.paises['Afganistán']}</option>
              <option value="Albania">{t.paises['Albania']}</option>
              <option value="Alemania">{t.paises['Alemania']}</option>
              <option value="Andorra">{t.paises['Andorra']}</option>
              <option value="Angola">{t.paises['Angola']}</option>
              <option value="Anguilla">{t.paises['Anguilla']}</option>
              <option value="Antártida">{t.paises['Antártida']}</option>
              <option value="Antigua y Barbuda">{t.paises['Antigua y Barbuda']}</option>
              <option value="Antillas Holandesas">{t.paises['Antillas Holandesas']}</option>
              <option value="Arabia Saudí">{t.paises['Arabia Saudí']}</option>
              <option value="Argelia">{t.paises['Argelia']}</option>
              <option value="Argentina">{t.paises['Argentina']}</option>
              <option value="Armenia">{t.paises['Armenia']}</option>
              <option value="Aruba">{t.paises['Aruba']}</option>
              <option value="Australia">{t.paises['Australia']}</option>
              <option value="Austria">{t.paises['Austria']}</option>
              <option value="Azerbaiyán">{t.paises['Azerbaiyán']}</option>
              <option value="Bahamas">{t.paises['Bahamas']}</option>
              <option value="Bahrein">{t.paises['Bahrein']}</option>
              <option value="Bangladesh">{t.paises['Bangladesh']}</option>
              <option value="Barbados">{t.paises['Barbados']}</option>
              <option value="Bélgica">{t.paises['Bélgica']}</option>
              <option value="Belice">{t.paises['Belice']}</option>
              <option value="Benin">{t.paises['Benin']}</option>
              <option value="Bermudas">{t.paises['Bermudas']}</option>
              <option value="Bielorrusia">{t.paises['Bielorrusia']}</option>
              <option value="Birmania">{t.paises['Birmania']}</option>
              <option value="Bolivia">{t.paises['Bolivia']}</option>
              <option value="Bosnia y Herzegovina">{t.paises['Bosnia y Herzegovina']}</option>
              <option value="Botswana">{t.paises['Botswana']}</option>
              <option value="Brasil">{t.paises['Brasil']}</option>
              <option value="Brunei">{t.paises['Brunei']}</option>
              <option value="Bulgaria">{t.paises['Bulgaria']}</option>
              <option value="Burkina Faso">{t.paises['Burkina Faso']}</option>
              <option value="Burundi">{t.paises['Burundi']}</option>
              <option value="Bután">{t.paises['Bután']}</option>
              <option value="Cabo Verde">{t.paises['Cabo Verde']}</option>
              <option value="Camboya">{t.paises['Camboya']}</option>
              <option value="Camerún">{t.paises['Camerún']}</option>
              <option value="Canadá">{t.paises['Canadá']}</option>
              <option value="Chad">{t.paises['Chad']}</option>
              <option value="Chile">{t.paises['Chile']}</option>
              <option value="China">{t.paises['China']}</option>
              <option value="Chipre">{t.paises['Chipre']}</option>
              <option value="Ciudad del Vaticano">{t.paises['Ciudad del Vaticano']}</option>
              <option value="Colombia">{t.paises['Colombia']}</option>
              <option value="Comores">{t.paises['Comores']}</option>
              <option value="Congo">{t.paises['Congo']}</option>
              <option value="Congo, República Democrática del">{t.paises['Congo, República Democrática del']}</option>
              <option value="Corea">{t.paises['Corea']}</option>
              <option value="Corea del Norte">{t.paises['Corea del Norte']}</option>
              <option value="Costa de Marfíl">{t.paises['Costa de Marfíl']}</option>
              <option value="Costa Rica">{t.paises['Costa Rica']}</option>
              <option value="Croacia Hrvatska">{t.paises['Croacia Hrvatska']}</option>
              <option value="Cuba">{t.paises['Cuba']}</option>
              <option value="Dinamarca">{t.paises['Dinamarca']}</option>
              <option value="Djibouti">{t.paises['Djibouti']}</option>
              <option value="Dominica">{t.paises['Dominica']}</option>
              <option value="Ecuador">{t.paises['Ecuador']}</option>
              <option value="Egipto">{t.paises['Egipto']}</option>
              <option value="El Salvador">{t.paises['El Salvador']}</option>
              <option value="Emiratos Árabes Unidos">{t.paises['Emiratos Árabes Unidos']}</option>
              <option value="Eritrea">{t.paises['Eritrea']}</option>
              <option value="Eslovenia">{t.paises['Eslovenia']}</option>
              <option value="España">{t.paises['España']}</option>
              <option value="Estados Unidos">{t.paises['Estados Unidos']}</option>
              <option value="Estonia">{t.paises['Estonia']}</option>
              <option value="Etiopía">{t.paises['Etiopía']}</option>
              <option value="Fiji">{t.paises['Fiji']}</option>
              <option value="Filipinas">{t.paises['Filipinas']}</option>
              <option value="Finlandia">{t.paises['Finlandia']}</option>
              <option value="Francia">{t.paises['Francia']}</option>
              <option value="Gabón">{t.paises['Gabón']}</option>
              <option value="Gambia">{t.paises['Gambia']}</option>
              <option value="Georgia">{t.paises['Georgia']}</option>
              <option value="Ghana">{t.paises['Ghana']}</option>
              <option value="Gibraltar">{t.paises['Gibraltar']}</option>
              <option value="Granada">{t.paises['Granada']}</option>
              <option value="Grecia">{t.paises['Grecia']}</option>
              <option value="Groenlandia">{t.paises['Groenlandia']}</option>
              <option value="Guadalupe">{t.paises['Guadalupe']}</option>
              <option value="Guam">{t.paises['Guam']}</option>
              <option value="Guatemala">{t.paises['Guatemala']}</option>
              <option value="Guayana">{t.paises['Guayana']}</option>
              <option value="Guayana Francesa">{t.paises['Guayana Francesa']}</option>
              <option value="Guinea">{t.paises['Guinea']}</option>
              <option value="Guinea Ecuatorial">{t.paises['Guinea Ecuatorial']}</option>
              <option value="Guinea-Bissau">{t.paises['Guinea-Bissau']}</option>
              <option value="Haití">{t.paises['Haití']}</option>
              <option value="Honduras">{t.paises['Honduras']}</option>
              <option value="Hungría">{t.paises['Hungría']}</option>
              <option value="India">{t.paises['India']}</option>
              <option value="Indonesia">{t.paises['Indonesia']}</option>
              <option value="Irak">{t.paises['Irak']}</option>
              <option value="Irán">{t.paises['Irán']}</option>
              <option value="Irlanda">{t.paises['Irlanda']}</option>
              <option value="Isla Bouvet">{t.paises['Isla Bouvet']}</option>
              <option value="Isla de Christmas">{t.paises['Isla de Christmas']}</option>
              <option value="Islandia">{t.paises['Islandia']}</option>
              <option value="Islas Caimán">{t.paises['Islas Caimán']}</option>
              <option value="Islas Cook">{t.paises['Islas Cook']}</option>
              <option value="Islas de Cocos o Keeling">{t.paises['Islas de Cocos o Keeling']}</option>
              <option value="Islas Faroe">{t.paises['Islas Faroe']}</option>
              <option value="Islas Heard y McDonald">{t.paises['Islas Heard y McDonald']}</option>
              <option value="Islas Malvinas">{t.paises['Islas Malvinas']}</option>
              <option value="Islas Marianas del Norte">{t.paises['Islas Marianas del Norte']}</option>
              <option value="Islas Marshall">{t.paises['Islas Marshall']}</option>
              <option value="Islas menores de Estados Unidos">{t.paises['Islas menores de Estados Unidos']}</option>
              <option value="Islas Palau">{t.paises['Islas Palau']}</option>
              <option value="Islas Salomón">{t.paises['Islas Salomón']}</option>
              <option value="Islas Svalbard y Jan Mayen">{t.paises['Islas Svalbard y Jan Mayen']}</option>
              <option value="Islas Tokelau">{t.paises['Islas Tokelau']}</option>
              <option value="Islas Turks y Caicos">{t.paises['Islas Turks y Caicos']}</option>
              <option value="Islas Vírgenes (EEUU)">{t.paises['Islas Vírgenes (EEUU)']}</option>
              <option value="Islas Vírgenes (Reino Unido)">{t.paises['Islas Vírgenes (Reino Unido)']}</option>
              <option value="Islas Wallis y Futuna">{t.paises['Islas Wallis y Futuna']}</option>
              <option value="Israel">{t.paises['Israel']}</option>
              <option value="Italia">{t.paises['Italia']}</option>
              <option value="Jamaica">{t.paises['Jamaica']}</option>
              <option value="Japón">{t.paises['Japón']}</option>
              <option value="Jordania">{t.paises['Jordania']}</option>
              <option value="Kazajistán">{t.paises['Kazajistán']}</option>
              <option value="Kenia">{t.paises['Kenia']}</option>
              <option value="Kirguizistán">{t.paises['Kirguizistán']}</option>
              <option value="Kiribati">{t.paises['Kiribati']}</option>
              <option value="Kuwait">{t.paises['Kuwait']}</option>
              <option value="Laos">{t.paises['Laos']}</option>
              <option value="Lesotho">{t.paises['Lesotho']}</option>
              <option value="Letonia">{t.paises['Letonia']}</option>
              <option value="Líbano">{t.paises['Líbano']}</option>
              <option value="Liberia">{t.paises['Liberia']}</option>
              <option value="Libia">{t.paises['Libia']}</option>
              <option value="Liechtenstein">{t.paises['Liechtenstein']}</option>
              <option value="Lituania">{t.paises['Lituania']}</option>
              <option value="Luxemburgo">{t.paises['Luxemburgo']}</option>
              <option value="Macedonia, Ex-República Yugoslava de">{t.paises['Macedonia, Ex-República Yugoslava de']}</option>
              <option value="Madagascar">{t.paises['Madagascar']}</option>
              <option value="Malasia">{t.paises['Malasia']}</option>
              <option value="Malawi">{t.paises['Malawi']}</option>
              <option value="Maldivas">{t.paises['Maldivas']}</option>
              <option value="Malí">{t.paises['Malí']}</option>
              <option value="Malta">{t.paises['Malta']}</option>
              <option value="Marruecos">{t.paises['Marruecos']}</option>
              <option value="Martinica">{t.paises['Martinica']}</option>
              <option value="Mauricio">{t.paises['Mauricio']}</option>
              <option value="Mauritania">{t.paises['Mauritania']}</option>
              <option value="Mayotte">{t.paises['Mayotte']}</option>
              <option value="México">{t.paises['México']}</option>
              <option value="Micronesia">{t.paises['Micronesia']}</option>
              <option value="Moldavia">{t.paises['Moldavia']}</option>
              <option value="Mónaco">{t.paises['Mónaco']}</option>
              <option value="Mongolia">{t.paises['Mongolia']}</option>
              <option value="Montserrat">{t.paises['Montserrat']}</option>
              <option value="Mozambique">{t.paises['Mozambique']}</option>
              <option value="Namibia">{t.paises['Namibia']}</option>
              <option value="Nauru">{t.paises['Nauru']}</option>
              <option value="Nepal">{t.paises['Nepal']}</option>
              <option value="Nicaragua">{t.paises['Nicaragua']}</option>
              <option value="Níger">{t.paises['Níger']}</option>
              <option value="Nigeria">{t.paises['Nigeria']}</option>
              <option value="Niue">{t.paises['Niue']}</option>
              <option value="Norfolk">{t.paises['Norfolk']}</option>
              <option value="Noruega">{t.paises['Noruega']}</option>
              <option value="Nueva Caledonia">{t.paises['Nueva Caledonia']}</option>
              <option value="Nueva Zelanda">{t.paises['Nueva Zelanda']}</option>
              <option value="Omán">{t.paises['Omán']}</option>
              <option value="Países Bajos">{t.paises['Países Bajos']}</option>
              <option value="Panamá">{t.paises['Panamá']}</option>
              <option value="Papúa Nueva Guinea">{t.paises['Papúa Nueva Guinea']}</option>
              <option value="Paquistán">{t.paises['Paquistán']}</option>
              <option value="Paraguay">{t.paises['Paraguay']}</option>
              <option value="Perú">{t.paises['Perú']}</option>
              <option value="Pitcairn">{t.paises['Pitcairn']}</option>
              <option value="Polinesia Francesa">{t.paises['Polinesia Francesa']}</option>
              <option value="Polonia">{t.paises['Polonia']}</option>
              <option value="Portugal">{t.paises['Portugal']}</option>
              <option value="Puerto Rico">{t.paises['Puerto Rico']}</option>
              <option value="Qatar">{t.paises['Qatar']}</option>
              <option value="Reino Unido">{t.paises['Reino Unido']}</option>
              <option value="República Centroafricana">{t.paises['República Centroafricana']}</option>
              <option value="República Checa">{t.paises['República Checa']}</option>
              <option value="República de Sudáfrica">{t.paises['República de Sudáfrica']}</option>
              <option value="República Dominicana">{t.paises['República Dominicana']}</option>
              <option value="República Eslovaca">{t.paises['República Eslovaca']}</option>
              <option value="Reunión">{t.paises['Reunión']}</option>
              <option value="Ruanda">{t.paises['Ruanda']}</option>
              <option value="Rumania">{t.paises['Rumania']}</option>
              <option value="Rusia">{t.paises['Rusia']}</option>
              <option value="Sahara Occidental">{t.paises['Sahara Occidental']}</option>
              <option value="Saint Kitts y Nevis">{t.paises['Saint Kitts y Nevis']}</option>
              <option value="Samoa">{t.paises['Samoa']}</option>
              <option value="Samoa Americana">{t.paises['Samoa Americana']}</option>
              <option value="San Marino">{t.paises['San Marino']}</option>
              <option value="San Vicente y Granadinas">{t.paises['San Vicente y Granadinas']}</option>
              <option value="Santa Helena">{t.paises['Santa Helena']}</option>
              <option value="Santa Lucía">{t.paises['Santa Lucía']}</option>
              <option value="Santo Tomé y Príncipe">{t.paises['Santo Tomé y Príncipe']}</option>
              <option value="Senegal">{t.paises['Senegal']}</option>
              <option value="Seychelles">{t.paises['Seychelles']}</option>
              <option value="Sierra Leona">{t.paises['Sierra Leona']}</option>
              <option value="Singapur">{t.paises['Singapur']}</option>
              <option value="Siria">{t.paises['Siria']}</option>
              <option value="Somalia">{t.paises['Somalia']}</option>
              <option value="Sri Lanka">{t.paises['Sri Lanka']}</option>
              <option value="St Pierre y Miquelon">{t.paises['St Pierre y Miquelon']}</option>
              <option value="Suazilandia">{t.paises['Suazilandia']}</option>
              <option value="Sudán">{t.paises['Sudán']}</option>
              <option value="Suecia">{t.paises['Suecia']}</option>
              <option value="Suiza">{t.paises['Suiza']}</option>
              <option value="Surinam">{t.paises['Surinam']}</option>
              <option value="Tailandia">{t.paises['Tailandia']}</option>
              <option value="Taiwán">{t.paises['Taiwán']}</option>
              <option value="Tanzania">{t.paises['Tanzania']}</option>
              <option value="Tayikistán">{t.paises['Tayikistán']}</option>
              <option value="Territorios franceses del Sur">{t.paises['Territorios franceses del Sur']}</option>
              <option value="Timor Oriental">{t.paises['Timor Oriental']}</option>
              <option value="Togo">{t.paises['Togo']}</option>
              <option value="Tonga">{t.paises['Tonga']}</option>
              <option value="Trinidad y Tobago">{t.paises['Trinidad y Tobago']}</option>
              <option value="Túnez">{t.paises['Túnez']}</option>
              <option value="Turkmenistán">{t.paises['Turkmenistán']}</option>
              <option value="Turquía">{t.paises['Turquía']}</option>
              <option value="Tuvalu">{t.paises['Tuvalu']}</option>
              <option value="Ucrania">{t.paises['Ucrania']}</option>
              <option value="Uganda">{t.paises['Uganda']}</option>
              <option value="Uruguay">{t.paises['Uruguay']}</option>
              <option value="Uzbekistán">{t.paises['Uzbekistán']}</option>
              <option value="Vanuatu">{t.paises['Vanuatu']}</option>
              <option value="Venezuela">{t.paises['Venezuela']}</option>
              <option value="Vietnam">{t.paises['Vietnam']}</option>
              <option value="Yemen">{t.paises['Yemen']}</option>
              <option value="Yugoslavia">{t.paises['Yugoslavia']}</option>
              <option value="Zambia">{t.paises['Zambia']}</option>
              <option value="Zimbabue">{t.paises['Zimbabue']}</option>
            </select>

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
    </LocalizationProvider>
  )
}

export default App