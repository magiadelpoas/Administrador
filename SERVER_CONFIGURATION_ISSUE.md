# Problema de Configuración del Servidor

## Diagnóstico del Problema

El servidor `https://sistema.magiadelpoas.com` está configurado para servir el landing page (HTML) en todas las rutas, incluyendo las rutas de la API. Esto impide que los archivos PHP de la API funcionen correctamente.

### Evidencia del Problema:
- Todas las peticiones a la API devuelven HTML del landing page
- Los archivos PHP no se ejecutan
- El servidor responde con código 200 pero con contenido HTML

## Soluciones Posibles

### Opción 1: Configurar el Servidor Web (Recomendado)

El administrador del servidor necesita configurar el servidor web para que:

1. **Sirva archivos PHP directamente** cuando existan
2. **Redirija solo las rutas no encontradas** al landing page
3. **Configure correctamente los virtual hosts**

#### Configuración de Apache (.htaccess):
```apache
RewriteEngine On

# Servir archivos PHP directamente si existen
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule \.php$ - [L]

# Servir archivos estáticos si existen
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule . - [L]

# Solo redirigir al landing page si el archivo no existe
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

#### Configuración de Nginx:
```nginx
location ~ \.php$ {
    try_files $uri =404;
    fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

### Opción 2: Usar un Subdominio Diferente

Crear un subdominio específico para la API:
- `api.magiadelpoas.com` - Para la API
- `sistema.magiadelpoas.com` - Para el landing page

### Opción 3: Usar un Puerto Diferente

Configurar la API en un puerto diferente:
- `sistema.magiadelpoas.com:8080` - Para la API
- `sistema.magiadelpoas.com` - Para el landing page

## Solución Temporal para Desarrollo

Mientras se configura el servidor, se puede usar una solución temporal:

### 1. Crear un Endpoint en el Landing Page

Agregar un endpoint PHP directamente en el directorio del landing page:

```php
// En el directorio del landing page
<?php
// endpoint.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Procesar la reserva
// ... código de procesamiento ...
?>
```

### 2. Usar un Servicio Externo

Usar un servicio como:
- Firebase Functions
- Vercel Functions
- Netlify Functions

### 3. Configurar un Servidor Separado

Usar un servidor separado solo para la API:
- Heroku
- DigitalOcean
- AWS

## Archivos que Necesitan Subirse

Una vez que el servidor esté configurado correctamente, subir estos archivos:

### Archivos Principales:
- `reservas_landing.php` - Endpoint principal
- `models/ReservaLanding.php` - Modelo de datos
- `controllers/ReservaLandingController.php` - Controlador
- `config/Database.php` - Configuración de BD
- `config/Config.php` - Configuración general

### Archivos de Soporte:
- `.htaccess` - Configuración de Apache
- `imgComprobantes/` - Directorio para archivos

## Verificación Post-Configuración

Una vez configurado el servidor, verificar con:

```bash
# Probar endpoint de salud
curl -X GET "https://sistema.magiadelpoas.com/reservas_landing.php"

# Probar creación de reserva
curl -X POST "https://sistema.magiadelpoas.com/reservas_landing.php" \
  -F "cabana=1" \
  -F "fullname=Test User" \
  -F "email=test@example.com"
```

## Contacto

Para configurar el servidor, contactar al administrador del sistema o al proveedor de hosting (Hostinger en este caso).

## Notas Adicionales

- El servidor actual usa Hostinger
- La configuración actual redirige todo al landing page
- Los archivos PHP están creados y listos para funcionar
- Solo necesita configuración del servidor web
