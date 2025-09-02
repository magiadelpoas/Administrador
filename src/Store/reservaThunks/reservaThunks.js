import { api } from '../../Api/Api';

/**
 * ========================================
 * THUNKS PARA RESERVAS
 * ========================================
 * Funciones asíncronas para manejar las operaciones CRUD de reservas
 * con la API del backend.
 */

/**
 * Crear una nueva reserva
 * @param {Object} reservaData - Datos de la reserva
 * @param {File} primerDeposito - Archivo del primer depósito (opcional)
 * @param {File} segundoDeposito - Archivo del segundo depósito (opcional)
 * @returns {Promise} Resultado de la operación
 */
export const crearReserva = async (reservaData, primerDeposito = null, segundoDeposito = null) => {
  try {
    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Agregar todos los datos de la reserva
    Object.keys(reservaData).forEach(key => {
      if (key === 'extras') {
        // Los extras se envían como JSON string
        formData.append(key, JSON.stringify(reservaData[key]));
      } else {
        formData.append(key, reservaData[key]);
      }
    });
    
    // Agregar archivos si existen
    if (primerDeposito) {
      formData.append('primerDeposito', primerDeposito);
    }
    
    if (segundoDeposito) {
      formData.append('segundoDeposito', segundoDeposito);
    }
    
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Realizar petición
    const response = await api.post('/reservas', formData, {
      headers: headers,
      // No establecer Content-Type para que se establezca automáticamente con FormData
    });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva creada exitosamente'
    };
    
  } catch (error) {
    console.error('Error al crear reserva:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al crear la reserva',
      error: error
    };
  }
};

/**
 * Obtener todas las reservas con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Límite de resultados por página
 * @param {string} search - Término de búsqueda (opcional)
 * @returns {Promise} Resultado de la operación
 */
export const obtenerReservas = async (page = 1, limit = 20, search = '') => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Construir query parameters
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    const url = `/reservas${queryString ? `?${queryString}` : ''}`;
    
    // Realizar petición
    const response = await api.get(url, { headers });
    
    return {
      success: true,
      data: response.data,
      pagination: response.pagination,
      message: response.message || 'Reservas obtenidas exitosamente'
    };
    
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al obtener las reservas',
      error: error
    };
  }
};

/**
 * Obtener solo las reservas pendientes con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Límite de resultados por página
 * @param {string} search - Término de búsqueda (opcional)
 * @returns {Promise} Resultado de la operación
 */
export const obtenerReservasPendientes = async (page = 1, limit = 20, search = '') => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Construir query parameters
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    const url = `/reservas/pendientes${queryString ? `?${queryString}` : ''}`;
    
    // Realizar petición
    const response = await api.get(url, { headers });
    
    return {
      success: true,
      data: response.data,
      pagination: response.pagination,
      message: response.message || 'Reservas pendientes obtenidas exitosamente'
    };
    
  } catch (error) {
    console.error('Error al obtener reservas pendientes:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al obtener las reservas pendientes',
      error: error
    };
  }
};

/**
 * Obtener una reserva específica por ID
 * @param {number} id - ID de la reserva
 * @returns {Promise} Resultado de la operación
 */
export const obtenerReservaPorId = async (id) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Realizar petición
    const response = await api.get(`/reservas/${id}`, { headers });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva obtenida exitosamente'
    };
    
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al obtener la reserva',
      error: error
    };
  }
};

/**
 * Actualizar una reserva existente
 * @param {number} id - ID de la reserva
 * @param {FormData|Object} submitData - Datos de la reserva (FormData o Object)
 * @returns {Promise} Resultado de la operación
 */
export const actualizarReserva = async (id, submitData) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers base
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Realizar petición según el tipo de datos
    const response = await api.put(`/reservas/${id}`, submitData, {
      headers: headers
      // El Content-Type se establece automáticamente según el tipo de datos
    });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva actualizada exitosamente',
      changes: response.changes || null
    };
    
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al actualizar la reserva',
      error: error
    };
  }
};

/**
 * Eliminar una reserva (cambiar estado a cancelado)
 * @param {number} id - ID de la reserva
 * @returns {Promise} Resultado de la operación
 */
export const eliminarReserva = async (id) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Realizar petición
    const response = await api.delete(`/reservas/${id}`, { headers });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva cancelada exitosamente'
    };
    
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al cancelar la reserva',
      error: error
    };
  }
};

/**
 * Confirmar una reserva (cambiar estado a confirmado)
 * @param {number} id - ID de la reserva
 * @returns {Promise} Resultado de la operación
 */
export const confirmarReserva = async (id) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar petición PATCH para cambiar solo el estado
    const response = await api.patch(`/reservas/${id}/confirmar`, {}, { headers });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva confirmada exitosamente'
    };
    
  } catch (error) {
    console.error('Error al confirmar reserva:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al confirmar la reserva',
      error: error
    };
  }
};

/**
 * Cancelar una reserva (cambiar estado a cancelado)
 * @param {number} id - ID de la reserva
 * @returns {Promise} Resultado de la operación
 */
export const cancelarReserva = async (id) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar petición PATCH para cambiar solo el estado
    const response = await api.patch(`/reservas/${id}/cancelar`, {}, { headers });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva cancelada exitosamente'
    };
    
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al cancelar la reserva',
      error: error
    };
  }
};

/**
 * Reactivar una reserva (cambiar estado de cancelado a pendiente)
 * @param {number} id - ID de la reserva
 * @returns {Promise} Resultado de la operación
 */
export const reactivarReserva = async (id) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Configurar headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Realizar petición PATCH para cambiar solo el estado
    const response = await api.patch(`/reservas/${id}/reactivar`, {}, { headers });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Reserva reactivada exitosamente'
    };
    
  } catch (error) {
    console.error('Error al reactivar reserva:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Error al reactivar la reserva',
      error: error
    };
  }
};