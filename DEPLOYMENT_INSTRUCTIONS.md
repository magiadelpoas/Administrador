# Instrucciones de Despliegue - API Landing

## Archivos a Subir al Servidor

Para que la API del landing funcione correctamente en producción, asegúrate de subir estos archivos al servidor:

### Archivos Nuevos:
1. `models/ReservaLanding.php` - Modelo para reservas del landing
2. `controllers/ReservaLandingController.php` - Controlador del landing
3. `landing_reservas.php` - Endpoint simple alternativo
4. `.htaccess` - Configuración de Apache

### Archivos Modificados:
1. `index.php` - Agregadas rutas del landing y CORS
2. `LANDING_API.md` - Documentación

## Configuración del Servidor

### 1. Verificar que Apache tenga mod_rewrite habilitado
```bash
# En el servidor, verificar:
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 2. Verificar permisos de archivos
```bash
chmod 644 .htaccess
chmod 644 models/ReservaLanding.php
chmod 644 controllers/ReservaLandingController.php
chmod 644 landing_reservas.php
```

### 3. Verificar directorio de archivos
```bash
# Asegurarse de que existe y tiene permisos:
chmod 755 imgComprobantes/
```

## URLs de Prueba

### Endpoint Principal:
- `POST https://sistema.magiadelpoas.com/api/landing/reservas`

### Endpoint Alternativo (si el router no funciona):
- `POST https://sistema.magiadelpoas.com/landing_reservas.php`

### Health Check:
- `GET https://sistema.magiadelpoas.com/api/landing/health`

## Verificación Post-Despliegue

1. **Probar health check:**
```bash
curl -X GET "https://sistema.magiadelpoas.com/api/landing/health"
```

2. **Probar creación de reserva:**
```bash
curl -X POST "https://sistema.magiadelpoas.com/api/landing/reservas" \
  -F "cabana=1" \
  -F "fullname=Test User" \
  -F "email=test@example.com"
```

3. **Verificar logs del servidor:**
```bash
tail -f /var/log/apache2/error.log
```

## Solución de Problemas

### Si el endpoint principal no funciona:
1. Usar el endpoint alternativo: `landing_reservas.php`
2. Verificar que mod_rewrite esté habilitado
3. Verificar permisos del archivo .htaccess

### Si hay errores de CORS:
1. Verificar que los headers CORS estén configurados
2. Verificar que `https://landing.magiadelpoas.com` esté en allowedOrigins

### Si hay errores de base de datos:
1. Verificar conexión a la base de datos
2. Verificar que la tabla `reserva_tbl` existe
3. Verificar permisos de la base de datos

## Configuración de CORS

Los siguientes orígenes están permitidos:
- `https://landing.magiadelpoas.com`
- `http://localhost:5173` (desarrollo)
- `http://127.0.0.1:5173` (desarrollo)

## Logs y Monitoreo

Los logs se guardan en:
- Apache: `/var/log/apache2/error.log`
- PHP: Configurado en `index.php` línea 224
- Aplicación: Los errores se loggean con `error_log()`
