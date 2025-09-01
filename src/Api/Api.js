import axios from 'axios';

class Api {
  constructor() {
    // Detectar el entorno y establecer la URL base
    this.baseURL = this.getBaseURL();
    
    // Crear instancia de axios con configuración base
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      withCredentials: false // Importante para CORS
    });

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Si el error es 401 (Unauthorized), limpiar el token
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('adminData');
          localStorage.removeItem('tokenExpiresAt');
          this.setAuthToken(null);
          
          // Redirigir al login si estamos en una página protegida
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Método para detectar el entorno y establecer la URL base
  getBaseURL() {
    const currentHost = window.location.hostname;
    
    // Siempre usar apiMagia.com (con M mayúscula) para evitar problemas de DNS
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://apiMagia.com/api';
    } else if (currentHost === 'sistema.magiadelpoas.com') {
      return 'https://apimagia.magiadelpoas.com/api';
    } else {
      // Fallback para otros entornos - usar apiMagia.com
      return 'http://apiMagia.com/api';
    }
  }



  // Método genérico para peticiones GET
  async get(endpoint, config = {}) {
    try {
      const response = await this.client.get(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método genérico para peticiones POST
  async post(endpoint, data = {}, config = {}) {
    try {
      // Si los datos son FormData, no establecer Content-Type para que se establezca automáticamente
      if (data instanceof FormData) {
        // Remover Content-Type si existe para que se establezca automáticamente
        if (config.headers && config.headers['Content-Type']) {
          delete config.headers['Content-Type'];
        }
      } else {
        // Para datos JSON, establecer Content-Type
        if (!config.headers) config.headers = {};
        config.headers['Content-Type'] = 'application/json';
      }
      
      const response = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método genérico para peticiones PUT
  async put(endpoint, data = {}, config = {}) {
    try {
      // Si los datos son FormData, no establecer Content-Type para que se establezca automáticamente
      if (data instanceof FormData) {
        // Remover Content-Type si existe para que se establezca automáticamente
        if (config.headers && config.headers['Content-Type']) {
          delete config.headers['Content-Type'];
        }
      } else {
        // Para datos JSON, establecer Content-Type
        if (!config.headers) config.headers = {};
        config.headers['Content-Type'] = 'application/json';
      }
      
      const response = await this.client.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método genérico para peticiones DELETE
  async delete(endpoint, config = {}) {
    try {
      const response = await this.client.delete(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método genérico para peticiones PATCH
  async patch(endpoint, data = {}, config = {}) {
    try {
      // Si los datos son FormData, no establecer Content-Type para que se establezca automáticamente
      if (data instanceof FormData) {
        // Remover Content-Type si existe para que se establezca automáticamente
        if (config.headers && config.headers['Content-Type']) {
          delete config.headers['Content-Type'];
        }
      } else {
        // Para datos JSON, establecer Content-Type
        if (!config.headers) config.headers = {};
        config.headers['Content-Type'] = 'application/json';
      }
      
      const response = await this.client.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método para establecer el token de autenticación
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }
}

// Exportar una instancia única de la API
export const api = new Api();
export default api;
