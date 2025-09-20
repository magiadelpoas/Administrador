# Guía de Validación de Disponibilidad de Fechas

## Resumen
Se ha implementado un sistema completo de validación de disponibilidad de fechas que verifica en tiempo real si las fechas seleccionadas por el usuario están disponibles para la cabaña elegida.

## Flujo de Validación

### 1. Frontend (React)
- **Archivo**: `LandingPage/src/Utils.jsx`
- **Función**: `validateDateAvailability()`
- **Trigger**: Se ejecuta cuando el usuario selecciona fechas de ingreso o salida

### 2. API Endpoint
- **Archivo**: `ApiMagia/api/validate_availability.php`
- **Método**: POST
- **URL**: `https://apimagia.magiadelpoas.com/api/validate_availability.php`

### 3. Backend (PHP)
- **Archivo**: `ApiMagia/models/ReservaLanding.php`
- **Método**: `validateAvailability()`

## Lógica de Validación

### Condiciones de Conflicto
Un conflicto existe si se cumple cualquiera de estas condiciones:

1. **Ingreso dentro de reserva existente**: 
   - `fecha_ingreso_cliente >= fecha_ingreso_existente AND fecha_ingreso_cliente < fecha_salida_existente`

2. **Salida dentro de reserva existente**:
   - `fecha_salida_cliente > fecha_ingreso_existente AND fecha_salida_cliente <= fecha_salida_existente`

3. **Cliente engloba reserva existente**:
   - `fecha_ingreso_cliente <= fecha_ingreso_existente AND fecha_salida_cliente >= fecha_salida_existente`

4. **Mismo día de ingreso** (mismo día que salida anterior):
   - `fecha_ingreso_cliente = fecha_salida_existente`

### Consulta SQL
```sql
SELECT id_reserva, nombreCliente_reserva, fechaIngreso_reserva, fechaSalida_reserva 
FROM reserva_tbl 
WHERE cabanaId_reserva = :cabanaId 
AND estado_reserva = 'pendiente'
AND (
    -- Caso 1: El ingreso del cliente está dentro de una reserva existente
    (:fechaIngreso >= fechaIngreso_reserva AND :fechaIngreso < fechaSalida_reserva)
    OR
    -- Caso 2: La salida del cliente está dentro de una reserva existente
    (:fechaSalida > fechaIngreso_reserva AND :fechaSalida <= fechaSalida_reserva)
    OR
    -- Caso 3: El cliente engloba completamente una reserva existente
    (:fechaIngreso <= fechaIngreso_reserva AND :fechaSalida >= fechaSalida_reserva)
    OR
    -- Caso 4: Exactamente el mismo día de ingreso (mismo día de salida del anterior)
    (:fechaIngreso = fechaSalida_reserva)
)
```

## Ejemplo de Uso

### Escenario 1: Reserva Existente
- **Reserva existente**: 2025-08-05 a 2025-08-08
- **Cliente intenta**: 2025-08-05 a 2025-08-06
- **Resultado**: ❌ Conflicto (Caso 1: ingreso dentro de reserva existente)

### Escenario 2: Disponible
- **Reserva existente**: 2025-08-05 a 2025-08-08
- **Cliente intenta**: 2025-08-08 a 2025-08-10
- **Resultado**: ✅ Disponible (salida anterior = ingreso nuevo)

### Escenario 3: Conflicto Total
- **Reserva existente**: 2025-08-05 a 2025-08-08
- **Cliente intenta**: 2025-08-04 a 2025-08-09
- **Resultado**: ❌ Conflicto (Caso 3: engloba reserva existente)

## Respuestas de la API

### Éxito (Fechas Disponibles)
```json
{
  "success": true,
  "available": true,
  "message": "Las fechas seleccionadas están disponibles para esta cabaña",
  "timestamp": "2025-01-27 10:30:00"
}
```

### Error (Conflicto)
```json
{
  "success": false,
  "available": false,
  "message": "La cabaña no está disponible en las fechas seleccionadas. Conflicto con: Reserva #123 del 2025-08-05 al 2025-08-08",
  "conflicts": [
    {
      "id_reserva": "123",
      "nombreCliente_reserva": "Juan Pérez",
      "fechaIngreso_reserva": "2025-08-05",
      "fechaSalida_reserva": "2025-08-08"
    }
  ],
  "timestamp": "2025-01-27 10:30:00"
}
```

## Experiencia del Usuario

### 1. Selección de Fechas
- Usuario selecciona cabaña
- Usuario selecciona fecha de ingreso
- Usuario selecciona fecha de salida

### 2. Validación Automática
- Se muestra toast de "Validando disponibilidad..."
- Se hace llamada a la API
- Se procesa la respuesta

### 3. Respuesta Visual
- **Disponible**: Toast verde "Fechas disponibles"
- **Conflicto**: Modal de error con detalles del conflicto
- **Error de red**: Solo se loggea, no se molesta al usuario

### 4. Limpieza Automática
- Si hay conflicto, se limpian las fechas problemáticas
- Usuario puede seleccionar nuevas fechas

## Características Técnicas

### Seguridad
- ✅ Validación en backend (no confiable solo en frontend)
- ✅ Sanitización de parámetros SQL
- ✅ Validación de tipos de datos

### Performance
- ✅ Consulta SQL optimizada con índices
- ✅ Validación asíncrona (no bloquea UI)
- ✅ Timeout automático en frontend

### UX/UI
- ✅ Feedback visual inmediato
- ✅ Mensajes en español e inglés
- ✅ No interrumpe flujo del usuario
- ✅ Información clara sobre conflictos

## Archivos Modificados

1. **`ApiMagia/models/ReservaLanding.php`**: Método `validateAvailability()`
2. **`ApiMagia/api/validate_availability.php`**: Endpoint de validación
3. **`LandingPage/src/Utils.jsx`**: Función `validateDateAvailability()`
4. **`LandingPage/src/App.jsx`**: Integración en `onDateChange()`

## Testing

Para probar la validación:

1. Crear una reserva manualmente en la base de datos
2. Intentar crear otra reserva con fechas conflictivas
3. Verificar que se muestre el mensaje de error apropiado
4. Verificar que las fechas se limpien automáticamente

## Consideraciones Futuras

- [ ] Cache de validaciones para mejorar performance
- [ ] Validación en tiempo real mientras el usuario escribe fechas
- [ ] Mostrar calendario con fechas no disponibles marcadas
- [ ] Integración con sistema de notificaciones para reservas conflictivas
