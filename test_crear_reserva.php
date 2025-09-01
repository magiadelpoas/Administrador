<?php
/**
 * Archivo de prueba para crear una reserva
 * Simula la petición del frontend para verificar que todo funcione
 */

// Incluir archivos necesarios
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Reserva.php';
require_once __DIR__ . '/controllers/ReservaController.php';
require_once __DIR__ . '/utils/Response.php';

// Configurar manejo de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Prueba de Creación de Reserva</h1>";

try {
    // Simular datos del frontend
    $testData = [
        "cabañaId" => "1",
        "cabañaNombre" => "Antía",
        "cabañaColor" => "#E03045",
        "nombreCliente" => "roberto",
        "emailCliente" => "magiadelpoas@gmail.com",
        "nacionalidad" => "Costa Rica",
        "mascotas" => "No",
        "cantidadPersonas" => "5",
        "deposito" => "100%",
        "moneda" => "Colones",
        "totalDepositado" => "111111111111111111111111111",
        "horaIngreso" => "15:00",
        "horaSalida" => "11:00",
        "fechaIngreso" => "2025-08-31",
        "fechaSalida" => "2025-09-04",
        "tipoPagoPrimerDeposito" => "Sinpe móvil",
        "tipoPagoSegundoDeposito" => "",
        "tipoReserva" => "WhatsApp",
        "extras" => [],
        "isEdit" => false
    ];
    
    echo "<h2>1. Datos de prueba</h2>";
    echo "<pre>" . json_encode($testData, JSON_PRETTY_PRINT) . "</pre>";
    
    // Crear instancia del controlador
    $controller = new ReservaController();
    
    echo "<h2>2. Probando mapeo de campos</h2>";
    
    // Usar reflexión para acceder al método privado
    $reflection = new ReflectionClass($controller);
    $mapMethod = $reflection->getMethod('mapFrontendToDatabase');
    $mapMethod->setAccessible(true);
    
    $mappedData = $mapMethod->invoke($controller, $testData);
    
    echo "<h3>Datos mapeados:</h3>";
    echo "<pre>" . json_encode($mappedData, JSON_PRETTY_PRINT) . "</pre>";
    
    echo "<h2>3. Probando validación</h2>";
    
    // Usar reflexión para acceder al método privado de validación
    $validateMethod = $reflection->getMethod('validateReservaData');
    $validateMethod->setAccessible(true);
    
    $validationErrors = $validateMethod->invoke($controller, $mappedData, false);
    
    if (empty($validationErrors)) {
        echo "<p style='color: green;'>✓ Validación exitosa - No hay errores</p>";
    } else {
        echo "<p style='color: red;'>✗ Errores de validación:</p>";
        echo "<ul>";
        foreach ($validationErrors as $error) {
            echo "<li style='color: red;'>{$error}</li>";
        }
        echo "</ul>";
    }
    
    echo "<h2>4. Probando creación en base de datos</h2>";
    
    // Crear instancia del modelo
    $reservaModel = new Reserva();
    
    // Simular archivos vacíos
    $files = [];
    
    // Intentar crear la reserva
    $result = $reservaModel->create($mappedData, $files);
    
    if ($result['success']) {
        echo "<p style='color: green;'>✓ Reserva creada exitosamente!</p>";
        echo "<p>ID de la reserva: " . $result['data']['id_reserva'] . "</p>";
        echo "<p>Mensaje: " . $result['message'] . "</p>";
    } else {
        echo "<p style='color: red;'>✗ Error al crear la reserva:</p>";
        echo "<p style='color: red;'>" . $result['message'] . "</p>";
        if (isset($result['error'])) {
            echo "<p style='color: red;'>Error técnico: " . $result['error'] . "</p>";
        }
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    echo "<p>Archivo: " . $e->getFile() . "</p>";
    echo "<p>Línea: " . $e->getLine() . "</p>";
} catch (Error $e) {
    echo "<p style='color: red;'>Error fatal: " . $e->getMessage() . "</p>";
    echo "<p>Archivo: " . $e->getFile() . "</p>";
    echo "<p>Línea: " . $e->getLine() . "</p>";
}

echo "<h2>5. Verificar directorio de imágenes</h2>";

$uploadDir = __DIR__ . '/imgComprobantes/';
if (is_dir($uploadDir)) {
    echo "<p style='color: green;'>✓ Directorio de imágenes existe: {$uploadDir}</p>";
    echo "<p>Permisos: " . substr(sprintf('%o', fileperms($uploadDir)), -4) . "</p>";
} else {
    echo "<p style='color: red;'>✗ Directorio de imágenes no existe: {$uploadDir}</p>";
    echo "<p>Intentando crear directorio...</p>";
    
    if (mkdir($uploadDir, 0755, true)) {
        echo "<p style='color: green;'>✓ Directorio creado exitosamente</p>";
    } else {
        echo "<p style='color: red;'>✗ Error al crear directorio</p>";
    }
}

echo "<h2>6. Fin de la prueba</h2>";
echo "<p>Revisa los logs del servidor para más detalles sobre el proceso.</p>";
?>
