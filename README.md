# API Magia del Poas

Una API RESTful robusta desarrollada en PHP puro siguiendo el patrón MVC para la gestión de administradores del sistema Magia del Poas.

## 🚀 Características

- **Arquitectura MVC**: Estructura organizada y mantenible
- **Autenticación JWT**: Seguridad moderna con tokens
- **CRUD Completo**: Operaciones completas para administradores
- **Validación Robusta**: Validación de datos de entrada
- **CORS Configurado**: Listo para React y otros frontends
- **Paginación**: Consultas eficientes con paginación
- **Documentación**: Endpoints completamente documentados
- **Manejo de Errores**: Respuestas consistentes y descriptivas

## 📋 Requisitos

- PHP 7.4 o superior
- MySQL/MariaDB
- Servidor web (Apache/Nginx)
- Extensiones PHP: PDO, JSON

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <repository-url>
   cd ApiMagia
   ```

2. **Configurar la base de datos**
   - Crear la base de datos MySQL
   - Importar el archivo `admins.sql` (estructura ya incluida)
   - Actualizar credenciales en `config/Database.php`

3. **Configurar el servidor web**
   - Asegurar que el archivo `.htaccess` esté presente
   - Configurar el DocumentRoot hacia la carpeta del proyecto
   - Habilitar mod_rewrite en Apache

4. **Configurar permisos**
   ```bash
   chmod 755 -R ./
   ```

## ⚙️ Configuración

### Base de Datos
Editar `config/Database.php`:
```php
private $host = '127.0.0.1:3306';
private $db_name = 'u513634259_sistema_mg';
private $username = 'tu_usuario';
private $password = 'tu_contraseña';
```

### Configuración General
Editar `config/Config.php` para ajustar:
- Clave secreta JWT
- Configuraciones de seguridad
- Límites de paginación

## 🔗 Endpoints de la API

### Base URL
```
http://tu-dominio.com/api
```

### Autenticación

#### POST /api/auth/login
Autentica un administrador y devuelve un token JWT.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "admin": {
      "id_admin": 1,
      "name_admin": "Administrador",
      "email_admin": "admin@example.com"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_at": "2024-01-15 12:00:00"
  }
}
```

#### POST /api/auth/logout
Cierra la sesión del administrador actual.

**Headers:**
```
Authorization: Bearer <token>
```

#### GET /api/auth/me
Obtiene el perfil del administrador autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

### Administradores (CRUD)

#### GET /api/admins
Lista todos los administradores con paginación.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `search` (opcional): Término de búsqueda

**Response:**
```json
{
  "success": true,
  "message": "Administradores obtenidos exitosamente",
  "data": [
    {
      "id_admin": 1,
      "name_admin": "Administrador",
      "email_admin": "admin@example.com",
      "phone_admin": "12345678",
      "status_admin": 1
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_records": 1,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

#### GET /api/admins/{id}
Obtiene un administrador específico.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST /api/admins
Crea un nuevo administrador.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name_admin": "Nuevo Admin",
  "email_admin": "nuevo@example.com",
  "password_admin": "password123",
  "phone_admin": "87654321",
  "status_admin": 1
}
```

#### PUT /api/admins/{id}
Actualiza un administrador existente.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name_admin": "Admin Actualizado",
  "email_admin": "actualizado@example.com",
  "phone_admin": "11111111"
}
```

#### DELETE /api/admins/{id}
Elimina un administrador (soft delete).

**Headers:**
```
Authorization: Bearer <token>
```

### Reservas

#### GET /api/reservas
Lista todas las reservas con paginación.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `search` (opcional): Término de búsqueda

#### GET /api/reservas/pendientes
Lista solo las reservas pendientes con paginación.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `search` (opcional): Término de búsqueda

#### GET /api/reservas/confirmadas
Lista solo las reservas confirmadas con paginación.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `search` (opcional): Término de búsqueda

### Utilidades

#### GET /api/health
Verifica el estado de la API.

**Response:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15 10:30:00",
    "version": "1.0",
    "database": "Connected"
  }
}
```

#### GET /api/docs
Documentación completa de la API.

## 🔐 Autenticación

La API utiliza JSON Web Tokens (JWT) para la autenticación. Para acceder a endpoints protegidos:

1. Hacer login en `/api/auth/login`
2. Incluir el token en el header `Authorization: Bearer <token>`
3. El token expira en 24 horas por defecto

## 📝 Códigos de Estado HTTP

- `200` OK - Petición exitosa
- `201` Created - Recurso creado
- `400` Bad Request - Datos inválidos
- `401` Unauthorized - No autenticado
- `403` Forbidden - Sin permisos
- `404` Not Found - Recurso no encontrado
- `405` Method Not Allowed - Método no permitido
- `409` Conflict - Recurso ya existe
- `422` Unprocessable Entity - Errores de validación
- `500` Internal Server Error - Error del servidor

## 🧪 Pruebas con cURL

### Login
```bash
curl -X POST http://tu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Listar Administradores
```bash
curl -X GET http://tu-dominio.com/api/admins \
  -H "Authorization: Bearer <tu-token>"
```

### Crear Administrador
```bash
curl -X POST http://tu-dominio.com/api/admins \
  -H "Authorization: Bearer <tu-token>" \
  -H "Content-Type: application/json" \
  -d '{"name_admin":"Test Admin","email_admin":"test@example.com","password_admin":"password123"}'
```

## 📁 Estructura del Proyecto

```
ApiMagia/
├── config/
│   ├── Config.php          # Configuración general
│   └── Database.php        # Conexión a base de datos
├── controllers/
│   └── AdminController.php # Controlador de administradores
├── core/
│   └── Router.php          # Sistema de rutas
├── middleware/
│   └── AuthMiddleware.php  # Middleware de autenticación
├── models/
│   └── Admin.php           # Modelo de administrador
├── utils/
│   ├── JWT.php             # Utilidades JWT
│   ├── Response.php        # Respuestas HTTP
│   └── Validator.php       # Validación de datos
├── .htaccess               # Configuración Apache
├── index.php               # Punto de entrada
└── README.md               # Documentación
```

## 🔧 Personalización

### Agregar Nuevos Endpoints

1. **Crear el método en el controlador:**
```php
public function nuevoMetodo() {
    // Lógica del endpoint
}
```

2. **Registrar la ruta en `index.php`:**
```php
$router->get('/api/nueva-ruta', ['AdminController', 'nuevoMetodo']);
```

### Agregar Validaciones

Editar `utils/Validator.php` para agregar nuevas reglas de validación.

### Modificar Respuestas

Personalizar `utils/Response.php` para cambiar el formato de las respuestas.

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de entrada robusta
- Headers de seguridad configurados
- Sanitización de datos

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos
- Verificar credenciales en `config/Database.php`
- Asegurar que el servidor MySQL esté ejecutándose
- Verificar permisos de usuario de base de datos

### Error 404 en Todas las Rutas
- Verificar que mod_rewrite esté habilitado
- Confirmar que `.htaccess` esté presente
- Revisar configuración del servidor web

### Errores de CORS
- Los headers CORS ya están configurados
- Verificar que no haya conflictos con otros middlewares

## 📞 Soporte

Para soporte técnico o preguntas sobre la API, contactar al equipo de desarrollo de Magia del Poas.

## 📄 Licencia

Este proyecto es propiedad de Magia del Poas. Todos los derechos reservados.

---

**Versión:** 1.0  
**Última actualización:** 2024  
**Desarrollado por:** Magia del Poas Development Team
