/**
 * Configuración personalizada para SweetAlert2
 * Mantiene un estilo consistente en toda la aplicación
 */

// Configuración base para todos los alerts
export const swalConfig = {
  // Configuración de colores personalizados
  customClass: {
    popup: 'swal-custom-popup',
    title: 'swal-custom-title',
    content: 'swal-custom-content',
    confirmButton: 'swal-custom-confirm',
    cancelButton: 'swal-custom-cancel'
  },
  
  // Configuración de botones
  buttonsStyling: true,
  reverseButtons: true,
  
  // Configuración de animaciones
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
};

// Configuraciones específicas por tipo
export const swalConfigs = {
  // Configuración para confirmaciones
  confirm: {
    ...swalConfig,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  },
  
  // Configuración para errores
  error: {
    ...swalConfig,
    icon: 'error',
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Entendido'
  },
  
  // Configuración para advertencias
  warning: {
    ...swalConfig,
    icon: 'warning',
    confirmButtonColor: '#ffc107',
    confirmButtonText: 'Entendido'
  },
  
  // Configuración para éxito
  success: {
    ...swalConfig,
    icon: 'success',
    confirmButtonColor: '#28a745',
    confirmButtonText: 'Continuar'
  },
  
  // Configuración para loading
  loading: {
    ...swalConfig,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  }
};

// Funciones helper para alerts comunes
export const swalHelpers = {
  // Mostrar error de validación
  showValidationError: (errors) => {
    return Swal.fire({
      ...swalConfigs.error,
      title: 'Errores de validación',
      html: Array.isArray(errors) ? errors.join('<br>') : errors
    });
  },
  
  // Mostrar confirmación de acción
  showConfirmation: (title, message, confirmText = 'Sí, continuar') => {
    return Swal.fire({
      ...swalConfigs.confirm,
      title,
      html: message,
      confirmButtonText: confirmText
    });
  },
  
  // Mostrar mensaje de éxito
  showSuccess: (title, message) => {
    return Swal.fire({
      ...swalConfigs.success,
      title,
      html: message
    });
  },
  
  // Mostrar mensaje de error
  showError: (title, message) => {
    return Swal.fire({
      ...swalConfigs.error,
      title,
      text: message
    });
  },
  
  // Mostrar loading
  showLoading: (title, message) => {
    return Swal.fire({
      ...swalConfigs.loading,
      title,
      html: message
    });
  }
};

export default swalConfig;
