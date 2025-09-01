# Guía de Uso de SweetAlert2 en Magia del Poas

## 📋 Descripción

Esta guía explica cómo usar SweetAlert2 en el proyecto de administración de Magia del Poas. SweetAlert2 reemplaza los alerts nativos del navegador con alertas más atractivas y funcionales.

## 🚀 Instalación

SweetAlert2 ya está incluido en el proyecto a través de CDN en `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

## 📁 Archivos de Configuración

### 1. Configuración Principal
- **Archivo**: `src/utils/sweetalertConfig.js`
- **Propósito**: Configuraciones centralizadas y funciones helper

### 2. Estilos Personalizados
- **Archivo**: `src/styles/sweetalert.css`
- **Propósito**: Estilos CSS personalizados para SweetAlert2

## 🎨 Uso Básico

### Importar las funciones helper

```javascript
import { swalHelpers } from '../../utils/sweetalertConfig';
```

### Mostrar alertas de error

```javascript
// Error simple
swalHelpers.showError('Título', 'Mensaje de error');

// Error de validación (con array de errores)
swalHelpers.showValidationError(['Error 1', 'Error 2', 'Error 3']);
```

### Mostrar alertas de éxito

```javascript
swalHelpers.showSuccess('¡Éxito!', 'Operación completada correctamente');
```

### Mostrar confirmaciones

```javascript
const result = await swalHelpers.showConfirmation(
  '¿Confirmar acción?',
  '¿Está seguro de que desea continuar?',
  'Sí, continuar'
);

if (result.isConfirmed) {
  // Usuario confirmó
} else {
  // Usuario canceló
}
```

### Mostrar loading

```javascript
swalHelpers.showLoading(
  'Procesando...',
  '<div class="text-center">Cargando datos...</div>'
);
```

## 🎯 Ejemplos Específicos para Reservas

### Confirmación de creación de reserva

```javascript
const confirmResult = await swalHelpers.showConfirmation(
  '¿Confirmar creación de reserva?',
  `
    <div class="text-start">
      <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
      <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
      <p><strong>Fechas:</strong> ${formData.fechaIngreso} - ${formData.fechaSalida}</p>
      <p><strong>Total:</strong> ${formData.totalDepositado} ${formData.moneda}</p>
    </div>
  `,
  'Sí, crear reserva'
);
```

### Loading durante procesamiento

```javascript
swalHelpers.showLoading(
  'Creando reserva...',
  `
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Procesando datos de la reserva para <strong>${cabañaActual?.nombre}</strong></p>
    </div>
  `
);
```

### Éxito con detalles

```javascript
await swalHelpers.showSuccess(
  '¡Reserva creada exitosamente!',
  `
    <div class="text-start">
      <p><strong>Cabaña:</strong> ${cabañaActual?.nombre}</p>
      <p><strong>Cliente:</strong> ${formData.nombreCliente}</p>
      <p><strong>ID de Reserva:</strong> ${result.data?.id_reserva || 'N/A'}</p>
    </div>
  `
);
```

## 🎨 Personalización

### Configuraciones disponibles

```javascript
import { swalConfigs } from '../../utils/sweetalertConfig';

// Configuración para confirmaciones
swalConfigs.confirm

// Configuración para errores
swalConfigs.error

// Configuración para advertencias
swalConfigs.warning

// Configuración para éxito
swalConfigs.success

// Configuración para loading
swalConfigs.loading
```

### Uso directo de SweetAlert2

```javascript
import Swal from 'sweetalert2';

Swal.fire({
  icon: 'question',
  title: 'Título personalizado',
  html: 'Contenido HTML personalizado',
  showCancelButton: true,
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33'
});
```

## 🎨 Estilos CSS

Los estilos personalizados incluyen:

- **Bordes redondeados**: 12px para popups
- **Fuente**: Public Sans (consistente con el diseño)
- **Colores**: Paleta de colores del proyecto
- **Animaciones**: Efectos de entrada y salida suaves
- **Responsive**: Adaptación para dispositivos móviles
- **Hover effects**: Efectos en botones

## 🔧 Configuración Avanzada

### Configuración base

```javascript
export const swalConfig = {
  customClass: {
    popup: 'swal-custom-popup',
    title: 'swal-custom-title',
    content: 'swal-custom-content',
    confirmButton: 'swal-custom-confirm',
    cancelButton: 'swal-custom-cancel'
  },
  buttonsStyling: true,
  reverseButtons: true,
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
};
```

## 📱 Responsive Design

Los alerts se adaptan automáticamente a dispositivos móviles:

- **Desktop**: Tamaño completo con márgenes
- **Mobile**: Ancho reducido con márgenes ajustados
- **Botones**: Tamaño y padding optimizados para touch

## 🚨 Manejo de Errores

### Errores de validación

```javascript
const errors = validateForm(formData);
if (errors.length > 0) {
  await swalHelpers.showValidationError(errors);
  return;
}
```

### Errores de API

```javascript
try {
  const result = await apiCall();
  if (result.success) {
    await swalHelpers.showSuccess('Éxito', 'Operación completada');
  } else {
    swalHelpers.showError('Error', result.message);
  }
} catch (error) {
  swalHelpers.showError('Error inesperado', 'Ocurrió un error inesperado');
}
```

## 📝 Mejores Prácticas

1. **Usar funciones helper**: Siempre usar `swalHelpers` en lugar de `Swal.fire` directamente
2. **Mensajes claros**: Usar títulos y mensajes descriptivos
3. **HTML estructurado**: Usar HTML para mostrar información detallada
4. **Confirmaciones**: Siempre pedir confirmación para acciones destructivas
5. **Loading**: Mostrar loading durante operaciones asíncronas
6. **Consistencia**: Mantener el mismo estilo en toda la aplicación

## 🔄 Migración de Alerts

### Antes (Alert nativo)
```javascript
alert('Error: ' + errorMessage);
```

### Después (SweetAlert2)
```javascript
swalHelpers.showError('Error', errorMessage);
```

### Antes (Confirm nativo)
```javascript
if (confirm('¿Está seguro?')) {
  // Acción
}
```

### Después (SweetAlert2)
```javascript
const result = await swalHelpers.showConfirmation('Confirmar', '¿Está seguro?');
if (result.isConfirmed) {
  // Acción
}
```

## 📚 Recursos Adicionales

- [Documentación oficial de SweetAlert2](https://sweetalert2.github.io/)
- [Ejemplos y demos](https://sweetalert2.github.io/#examples)
- [Configuración avanzada](https://sweetalert2.github.io/#configuration)
