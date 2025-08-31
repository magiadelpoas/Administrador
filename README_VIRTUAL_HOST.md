# 🚀 API Magia del Poas - Configuración Virtual Host

## Configuración Actual

Tu API está configurada para funcionar con el dominio `apiMagia.com` usando un virtual host de Apache.

### Virtual Host Configurado
```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/Magia del Poas/ApiMagia"
    ServerName apiMagia.com
</VirtualHost>
```

### Entrada en hosts
```
127.0.0.1 apiMagia.com
```

## 📋 URLs de la API

### Base URL
```
http://apiMagia.com
```

### Endpoints Principales

#### 🔐 Autenticación
- **POST** `http://apiMagia.com/api/auth/login` - Iniciar sesión
- **POST** `http://apiMagia.com/api/auth/logout` - Cerrar sesión
- **GET** `http://apiMagia.com/api/auth/me` - Obtener perfil actual
- **PUT** `http://apiMagia.com/api/auth/profile` - Actualizar perfil

#### 👥 Administradores
- **GET** `http://apiMagia.com/api/admins` - Listar administradores
- **GET** `http://apiMagia.com/api/admins/{id}` - Obtener administrador específico
- **POST** `http://apiMagia.com/api/admins` - Crear administrador
- **PUT** `http://apiMagia.com/api/admins/{id}` - Actualizar administrador
- **DELETE** `http://apiMagia.com/api/admins/{id}` - Eliminar administrador

#### 🔧 Utilidades
- **GET** `http://apiMagia.com/api/health` - Estado de la API
- **GET** `http://apiMagia.com/api/docs` - Documentación completa

## 🧪 Pruebas

### 1. Verificar Configuración
Abre en tu navegador:
```
http://apiMagia.com/test_virtual_host.html
```

### 2. Health Check
```
GET http://apiMagia.com/api/health
```

### 3. Documentación
```
GET http://apiMagia.com/api/docs
```

## 📱 Ejemplos para Postman

### Collection de Postman
Crea una nueva collection llamada "Magia del Poas API"

### Variables de Entorno
- `base_url`: `http://apiMagia.com`
- `token`: (se llena automáticamente después del login)

### Request de Login
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
    "email": "tu_email@ejemplo.com",
    "password": "tu_contraseña"
}
```

**Script de Tests para guardar token:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
    }
}
```

### Request GET /api/admins
```
GET {{base_url}}/api/admins
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters (opcionales):**
- `page`: 1
- `limit`: 20
- `search`: término de búsqueda

## 🔧 Configuración de Archivos

### Archivos Modificados/Creados

1. **`.htaccess`** - Configuración de reescritura y CORS
2. **`config/Environment.php`** - Configuración de entorno
3. **`index.php`** - Actualizado para usar la nueva configuración
4. **`test_virtual_host.html`** - Página de pruebas

### Estructura de Archivos
```
ApiMagia/
├── .htaccess                    # Configuración Apache
├── index.php                    # Punto de entrada
├── config/
│   ├── Config.php              # Configuración general
│   ├── Database.php            # Configuración BD
│   └── Environment.php         # Configuración entorno
├── controllers/
│   └── AdminController.php     # Controlador principal
├── models/
│   └── Admin.php               # Modelo de datos
├── utils/
│   ├── Response.php            # Utilidades de respuesta
│   ├── JWT.php                 # Manejo de tokens
│   └── Validator.php           # Validación de datos
├── middleware/
│   └── AuthMiddleware.php      # Middleware de autenticación
├── core/
│   └── Router.php              # Enrutador
├── test_virtual_host.html      # Página de pruebas
└── README_VIRTUAL_HOST.md      # Este archivo
```

## 🚨 Solución de Problemas

### Error 404
- Verifica que Apache esté corriendo
- Verifica que el virtual host esté habilitado
- Verifica que la entrada en hosts sea correcta

### Error CORS
- El archivo `.htaccess` ya incluye la configuración CORS
- Verifica que mod_headers esté habilitado en Apache

### Error de Base de Datos
- Verifica las credenciales en `config/Database.php`
- Verifica que la base de datos esté accesible

### Error de Token
- Asegúrate de hacer login primero
- Verifica que el token no haya expirado (24 horas)

## 🔄 Flujo de Desarrollo

1. **Iniciar XAMPP** (Apache y MySQL)
2. **Verificar virtual host** visitando `http://apiMagia.com`
3. **Probar endpoints** usando `test_virtual_host.html`
4. **Desarrollar** usando Postman con la collection configurada
5. **Depurar** revisando los logs de Apache

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Apache en `C:\xampp\apache\logs\`
2. Verifica que todos los archivos estén en la ubicación correcta
3. Asegúrate de que el virtual host esté correctamente configurado
4. Prueba primero con `test_virtual_host.html`

---

**¡Tu API está lista para usar con el dominio apiMagia.com! 🎉**
