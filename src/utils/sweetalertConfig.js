/**
 * Configuración personalizada para SweetAlert2
 * Mantiene un estilo consistente en toda la aplicación
 */
import Swal from 'sweetalert2';

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

  // Mostrar errores de validación con formato mejorado
  showValidationErrors: (errors) => {
    const errorList = Array.isArray(errors) ? errors : [errors];
    const htmlContent = `
      <div style="text-align: left; padding: 10px;">
        <p style="margin-bottom: 15px; font-weight: bold;">Por favor corrija los siguientes errores:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;">
          ${errorList.map(error => `
            <div style="margin-bottom: 10px; display: flex; align-items: flex-start;">
              <span style="color: #dc3545; margin-right: 8px; font-weight: bold;">•</span>
              <span>${error}</span>
            </div>
          `).join('')}
        </div>
        <hr style="margin: 15px 0; border-color: #dee2e6;">
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 0; display: flex; align-items: center;">
          <i class="fas fa-info-circle" style="margin-right: 8px; color: #17a2b8;"></i>
          Los campos marcados en rojo requieren atención
        </p>
      </div>
    `;
    
    return Swal.fire({
      title: '❌ Formulario Incompleto',
      html: htmlContent,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#dc3545',
      customClass: {
        popup: 'swal-wide'
      }
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
      html: message
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
