# API de Reservas Landing Page

## Descripción
Esta API permite crear reservas desde el landing page sin necesidad de autenticación. Es una versión simplificada de la API principal de reservas.

## Endpoints Disponibles

### POST /api/landing/reservas
Crea una nueva reserva desde el landing page.

**Sin autenticación requerida**

#### Parámetros del FormData:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| cabana | string | ✅ | ID de la cabaña seleccionada (1-6) |
| fullname | string | ✅ | Nombre completo del cliente |
| email | string | ✅ | Email del cliente |
| phone | string | ❌ | Número de teléfono |
| currency | string | ❌ | Moneda (Colones/Dólares) |
| totalDepositado | string | ❌ | Total depositado |
| cantidadPersonas | string | ❌ | Cantidad de personas |
| pais | string | ❌ | País de origen |
| deposito | string | ❌ | Porcentaje de depósito |
| mascotas | string | ❌ | Permite mascotas (Si/No) |
| declaration | boolean | ❌ | Aceptación de términos |
| fechaIngreso | string | ❌ | Fecha de ingreso (YYYY-MM-DD) |
| fechaSalida | string | ❌ | Fecha de salida (YYYY-MM-DD) |
| extras | string | ❌ | Extras en formato JSON |
| proofOfAddress | file | ❌ | Archivo de comprobante de pago 1 |
| proofOfAddress2 | file | ❌ | Archivo de comprobante de pago 2 |

#### Respuesta Exitosa (201):
```json
{
  "success": true,
  "message": "Reserva creada exitosamente desde el landing page",
  "data": {
    "id_reserva": 123
  },
  "timestamp": "2024-01-15 10:30:00",
  "api_version": "1.0"
}
```

#### Respuesta de Error (400):
```json
{
  "success": false,
  "message": "El campo nombre completo es requerido",
  "timestamp": "2024-01-15 10:30:00",
  "api_version": "1.0"
}
```

### GET /api/landing/health
Verifica el estado del servicio de reservas landing.

**Sin autenticación requerida**

#### Respuesta (200):
```json
{
  "success": true,
  "message": "Servicio de reservas landing funcionando correctamente",
  "data": {
    "status": "OK",
    "service": "Reserva Landing API",
    "timestamp": "2024-01-15 10:30:00",
    "version": "1.0",
    "features": {
      "create_reservation": true,
      "file_upload": true,
      "validation": true
    }
  }
}
```

## Mapeo de Cabañas

| ID | Nombre | Tipo |
|----|--------|------|
| 1 | ANTÍA | Estándar |
| 2 | LILLIAM | Estándar |
| 3 | LUNA | Deluxe |
| 4 | ROBLE ESCONDIDO | Deluxe |
| 5 | GLAMPING | Glamping |
| 6 | COLIMA | Colima |

## Validaciones

### Campos Requeridos:
- cabana
- fullname
- email

### Validaciones Específicas:
- **Email**: Debe tener formato válido
- **Fechas**: La fecha de salida debe ser igual o posterior a la fecha de ingreso
- **Declaración**: Debe ser aceptada para continuar

### Archivos Permitidos:
- **Imágenes**: jpg, jpeg, png, gif, webp
- **Documentos**: pdf, doc, docx
- **Tamaño máximo**: Configurado en el servidor

## CORS
Los siguientes orígenes están permitidos:
- https://landing.magiadelpoas.com
- http://localhost:5173 (desarrollo)
- http://127.0.0.1:5173 (desarrollo)

## Ejemplo de Uso desde JavaScript

```javascript
const formData = new FormData();
formData.append('cabana', '1');
formData.append('fullname', 'Juan Pérez');
formData.append('email', 'juan@ejemplo.com');
formData.append('phone', '+506 8888-8888');
formData.append('currency', 'Colones');
formData.append('totalDepositado', '50000');
formData.append('cantidadPersonas', '2');
formData.append('pais', 'Costa Rica');
formData.append('deposito', '50%');
formData.append('mascotas', 'No');
formData.append('declaration', 'true');
formData.append('fechaIngreso', '2024-02-15');
formData.append('fechaSalida', '2024-02-17');
formData.append('extras', JSON.stringify(['Tabla de fiambres']));

// Agregar archivos si existen
if (file1) formData.append('proofOfAddress', file1);
if (file2) formData.append('proofOfAddress2', file2);

fetch('/api/landing/reservas', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Reserva creada:', data.data);
  } else {
    console.error('Error:', data.message);
  }
})
.catch(error => {
  console.error('Error de red:', error);
});
```

## Notas Importantes

1. **Sin Autenticación**: Este endpoint no requiere token de autenticación
2. **Estado Inicial**: Todas las reservas se crean con estado "pendiente"
3. **Archivos**: Se suben automáticamente al directorio `imgComprobantes/`
4. **Detección de Duplicados**: El sistema detecta archivos idénticos para evitar duplicados
5. **Logging**: Todas las operaciones se registran en los logs del servidor

## Diferencias con la API Principal

| Característica | API Principal | API Landing |
|----------------|---------------|-------------|
| Autenticación | ✅ Requerida | ❌ No requerida |
| Leer reservas | ✅ Disponible | ❌ No disponible |
| Actualizar reservas | ✅ Disponible | ❌ No disponible |
| Eliminar reservas | ✅ Disponible | ❌ No disponible |
| Crear reservas | ✅ Completa | ✅ Solo creación |
| Estados de reserva | ✅ Completo | ❌ Solo pendiente |
