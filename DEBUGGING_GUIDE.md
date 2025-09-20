# Guía de Debugging - Sistema de Logging de Errores

## Archivos Creados para Debugging

### 1. `error_logger.php`
Sistema de logging que registra todos los errores y peticiones.

### 2. `debug_endpoint.php`
Endpoint especial para diagnosticar problemas de conexión y configuración.

### 3. `view_logs.php`
Endpoint para ver los logs de errores en tiempo real.

### 4. `landing_endpoint.php` (actualizado)
Endpoint principal con logging completo.

## Cómo Usar el Sistema de Debugging

### Paso 1: Probar el Endpoint de Debugging

Visita en tu navegador:
```
https://sistema.magiadelpoas.com/debug_endpoint.php
```

Esto te mostrará:
- Información del servidor
- Estado de la base de datos
- Estado de escritura de archivos
- Configuración de PHP
- Variables de entorno

### Paso 2: Ver los Logs de Errores

Visita en tu navegador:
```
https://sistema.magiadelpoas.com/view_logs.php
```

Esto te mostrará:
- Todos los errores registrados
- Todas las peticiones recibidas
- Información del servidor
- Estado de los archivos de log

### Paso 3: Limpiar los Logs

Para limpiar los logs y empezar fresco:
```
https://sistema.magiadelpoas.com/view_logs.php?clear=true
```

### Paso 4: Probar el Endpoint Principal

Una vez que el debugging funcione, prueba el endpoint principal:
```
https://sistema.magiadelpoas.com/landing_endpoint.php
```

## Estructura de Logs

### Archivos de Log Creados:
- `logs/api_errors.log` - Errores de la API
- `logs/api_requests.log` - Peticiones y respuestas

### Directorio de Logs:
```
ApiMagia/
├── logs/
│   ├── api_errors.log
│   └── api_requests.log
├── error_logger.php
├── debug_endpoint.php
├── view_logs.php
└── landing_endpoint.php
```

## Información que se Registra

### En `api_errors.log`:
- Errores de PHP
- Errores de base de datos
- Errores de archivos
- Información general

### En `api_requests.log`:
- Todas las peticiones HTTP
- Datos enviados
- Headers recibidos
- Respuestas enviadas
- Códigos de estado

## Ejemplos de Uso

### 1. Verificar Estado del Servidor
```bash
curl "https://sistema.magiadelpoas.com/debug_endpoint.php"
```

### 2. Probar Petición POST
```bash
curl -X POST "https://sistema.magiadelpoas.com/debug_endpoint.php" \
  -F "cabana=1" \
  -F "fullname=Test User" \
  -F "email=test@example.com"
```

### 3. Ver Logs en Tiempo Real
```bash
curl "https://sistema.magiadelpoas.com/view_logs.php"
```

## Diagnóstico de Problemas

### Si el endpoint de debugging no funciona:
1. El servidor no está ejecutando PHP
2. Hay un problema de configuración del servidor
3. Los archivos no están en la ubicación correcta

### Si el endpoint de debugging funciona pero el principal no:
1. Problema con la base de datos
2. Error en la configuración de archivos
3. Problema con las validaciones

### Si ambos endpoints funcionan pero el frontend no:
1. Problema de CORS
2. Error en la URL del frontend
3. Problema de red/firewall

## Próximos Pasos

1. **Subir los archivos** al servidor
2. **Probar el endpoint de debugging** primero
3. **Revisar los logs** para identificar problemas
4. **Probar el endpoint principal** una vez que el debugging funcione
5. **Configurar el frontend** para usar la URL correcta

## Contacto para Soporte

Si necesitas ayuda adicional, proporciona:
1. La salida del endpoint de debugging
2. Los logs de errores
3. La configuración del servidor
4. Los mensajes de error específicos
