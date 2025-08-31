import { api } from '../../Api/Api';

// Thunk para el login
export const loginThunk = (email, password) => async (dispatch) => {
  try {
    // Llamar a la API
    const response = await api.post('/auth/login', { email, password });
    
    if (response.success) {
      // Guardar el token en localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      localStorage.setItem('tokenExpiresAt', response.data.expires_at);
      
      // Establecer el token en la API para futuras peticiones
      api.setAuthToken(response.data.token);
      
      return {
        success: true,
        message: response.message,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.message
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error de conexión. Intente nuevamente."
    };
  }
};

// Thunk para logout
export const logoutThunk = () => async (dispatch) => {
  try {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('tokenExpiresAt');
    
    // Limpiar token de la API
    api.setAuthToken(null);
    
    return {
      success: true,
      message: "Sesión cerrada exitosamente"
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al cerrar sesión"
    };
  }
};

// Thunk para verificar si el usuario está autenticado
export const checkAuthThunk = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('authToken');
    const adminData = localStorage.getItem('adminData');
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (token && adminData && expiresAt) {
      // Verificar si el token ha expirado
      const expirationDate = new Date(expiresAt);
      const currentDate = new Date();
      
      if (currentDate > expirationDate) {
        // Token expirado, limpiar datos
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('tokenExpiresAt');
        api.setAuthToken(null);
        
        return {
          success: false,
          message: "Token expirado"
        };
      }
      
      // Establecer el token en la API
      api.setAuthToken(token);
      
      return {
        success: true,
        data: {
          token,
          admin: JSON.parse(adminData),
          expiresAt
        }
      };
    } else {
      return {
        success: false,
        message: "No hay sesión activa"
      };
    }
  } catch (error) {
    console.error('Check auth error:', error);
    return {
      success: false,
      message: "Error al verificar autenticación"
    };
  }
};
