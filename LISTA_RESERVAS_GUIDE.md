# Guía de Lista de Reservas - Magia del Poas

## 📋 Descripción

Esta guía explica la funcionalidad implementada para mostrar y gestionar la lista de reservas en el sistema de administración de Magia del Poas.

## 🎯 Funcionalidades Implementadas

### 1. **Listado de Reservas**
- Muestra todas las reservas en una tabla responsiva
- Paginación automática (20 reservas por página)
- Búsqueda por cliente, email o cabaña
- Estados visuales (pendiente, confirmado, cancelado)

### 2. **Columnas Mostradas**
- **ID**: Número único de la reserva
- **Cabaña**: Nombre con indicador de color
- **Cliente**: Nombre y nacionalidad
- **Email**: Enlace clickeable para enviar email
- **Personas**: Cantidad de personas con badge
- **Depósito**: Porcentaje de depósito
- **Total**: Monto con moneda
- **Fechas**: Fechas de ingreso y salida
- **Hora Ingreso**: Hora de check-in
- **Tipo Pago**: Método de pago del primer depósito
- **Estado**: Badge con color según estado
- **Acciones**: Botones para editar, cancelar y ver comprobante

### 3. **Acciones Disponibles**
- **Editar**: Redirige al formulario de edición
- **Cancelar**: Cambia el estado a "cancelado" (soft delete)
- **Ver Comprobante**: Abre el archivo del primer depósito en nueva pestaña

## 🔧 Implementación Técnica

### Frontend (React)

#### Archivo: `ListaView.jsx`
```javascript
// Estados principales
const [reservas, setReservas] = useState([])
const [loading, setLoading] = useState(true)
const [pagination, setPagination] = useState({...})
const [searchTerm, setSearchTerm] = useState('')

// Funciones principales
const cargarReservas = async (page, search) => {...}
const handleSearch = (e) => {...}
const handlePageChange = (page) => {...}
const handleEliminar = async (id, nombreCliente) => {...}
```

#### Thunks: `reservaThunks.js`
```javascript
// Obtener reservas con paginación
export const obtenerReservas = async (page, limit, search) => {...}

// Eliminar reserva (cambiar estado)
export const eliminarReserva = async (id) => {...}
```

### Backend (PHP)

#### Controlador: `ReservaController.php`
```php
// GET /api/reservas - Listar reservas
public function index() {
    // Soporta paginación y búsqueda
    $page = $_GET['page'] ?? 1;
    $limit = $_GET['limit'] ?? 20;
    $search = $_GET['search'] ?? '';
}

// DELETE /api/reservas/{id} - Cancelar reserva
public function destroy($id) {
    // Cambia estado a 'cancelado'
}
```

#### Modelo: `Reserva.php`
```php
// Obtener reservas con paginación
public function getAll($page, $limit, $search) {
    // Consulta SQL con LIMIT y OFFSET
    // Búsqueda en nombre, email y cabaña
}

// Soft delete - cambiar estado
public function delete($id) {
    // UPDATE estado_reserva = 'cancelado'
}
```

## 🎨 Características de UI/UX

### 1. **Estados Visuales**
- **Pendiente**: Badge amarillo
- **Confirmado**: Badge verde
- **Cancelado**: Badge rojo

### 2. **Indicadores de Cabaña**
- Círculo de color que coincide con el color de la cabaña
- Nombre de la cabaña junto al indicador

### 3. **Formateo de Datos**
- **Fechas**: Formato local español (dd/mm/yyyy)
- **Moneda**: Monto + símbolo de moneda
- **Personas**: Badge con texto singular/plural

### 4. **Responsive Design**
- Tabla con scroll horizontal en móviles
- Botones de acción agrupados
- Paginación centrada

## 🔍 Funcionalidad de Búsqueda

### Campos de Búsqueda
- **Nombre del cliente**: Búsqueda parcial
- **Email del cliente**: Búsqueda parcial
- **Nombre de la cabaña**: Búsqueda parcial

### Implementación
```sql
WHERE (
    nombreCliente_reserva LIKE :search 
    OR emailCliente_reserva LIKE :search 
    OR cabanaNombre_reserva LIKE :search
)
```

## 📄 Paginación

### Configuración
- **Por defecto**: 20 registros por página
- **Máximo**: Configurable desde `Config.php`
- **Navegación**: Botones anterior/siguiente + números de página

### Información Mostrada
- Total de registros
- Página actual
- Total de páginas

## 🗑️ Gestión de Reservas

### Cancelación (Soft Delete)
- No elimina físicamente el registro
- Cambia `estado_reserva` a 'cancelado'
- Reservas canceladas no se pueden cancelar nuevamente
- Confirmación con SweetAlert2 antes de cancelar

### Edición
- Enlace directo al formulario de edición
- URL: `/reservas/editar/{id}`

### Comprobantes
- Enlace directo al archivo del primer depósito
- Se abre en nueva pestaña
- Solo visible si existe el archivo

## 🚨 Manejo de Errores

### Frontend
- Loading spinner durante carga
- Mensajes de error con SweetAlert2
- Estados vacíos con iconos descriptivos

### Backend
- Validación de parámetros
- Manejo de errores de base de datos
- Respuestas HTTP apropiadas

## 📱 Responsive Design

### Breakpoints
- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Tabla con scroll horizontal
- **Mobile**: Tabla compacta con scroll

### Adaptaciones
- Botones de acción agrupados
- Texto truncado en columnas largas
- Paginación optimizada para touch

## 🔐 Seguridad

### Autenticación
- Todas las rutas requieren token JWT
- Validación de permisos en middleware

### Validación
- Sanitización de parámetros de búsqueda
- Validación de IDs numéricos
- Escape de datos en consultas SQL

## 📊 Rendimiento

### Optimizaciones
- Paginación para evitar cargar muchos registros
- Índices en campos de búsqueda
- Consultas SQL optimizadas

### Caching
- No implementado actualmente
- Considerar cache de consultas frecuentes

## 🔄 Flujo de Datos

1. **Carga inicial**: `useEffect` → `cargarReservas()` → `obtenerReservas()`
2. **Búsqueda**: `handleSearch()` → `cargarReservas()` con término
3. **Paginación**: `handlePageChange()` → `cargarReservas()` con página
4. **Cancelación**: `handleEliminar()` → `eliminarReserva()` → recargar lista

## 📝 Próximas Mejoras

### Funcionalidades Sugeridas
- **Filtros avanzados**: Por fecha, estado, cabaña
- **Exportación**: PDF, Excel
- **Bulk actions**: Cancelar múltiples reservas
- **Notificaciones**: Alertas de nuevas reservas
- **Dashboard**: Estadísticas de reservas

### Optimizaciones
- **Lazy loading**: Cargar datos bajo demanda
- **Virtual scrolling**: Para listas muy grandes
- **Cache**: Redis para consultas frecuentes
- **WebSockets**: Actualizaciones en tiempo real

## 🧪 Testing

### Casos de Prueba
- Carga de lista vacía
- Paginación con muchos registros
- Búsqueda con resultados
- Búsqueda sin resultados
- Cancelación de reserva
- Manejo de errores de red

### Datos de Prueba
```sql
-- Insertar reservas de prueba
INSERT INTO reserva_tbl (
    cabanaId_reserva, cabanaNombre_reserva, nombreCliente_reserva,
    emailCliente_reserva, estado_reserva
) VALUES 
(1, 'Antía', 'Juan Pérez', 'juan@test.com', 'pendiente'),
(2, 'Bella Vista', 'María García', 'maria@test.com', 'confirmado');
```

## 📚 Recursos Adicionales

- [Documentación de SweetAlert2](./SWEETALERT_GUIDE.md)
- [Guía de API de Reservas](../ApiMagia/README.md)
- [Documentación de Bootstrap](https://getbootstrap.com/docs/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
