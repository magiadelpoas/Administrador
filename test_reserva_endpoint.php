<?php
/**
 * Archivo de prueba para verificar el endpoint de reservas
 */

// Incluir archivos necesarios
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Reserva.php';

// Configurar el entorno
define('DEVELOPMENT', true);
if (DEVELOPMENT) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Inicializar configuración
Config::init();

echo "<h1>Prueba del Endpoint de Reservas</h1>";

try {
    // Crear instancia del modelo
    $reservaModel = new Reserva();
    
    echo "<h2>1. Probando obtener todas las reservas:</h2>";
    $result = $reservaModel->getAll(1, 5);
    
    if ($result['success']) {
        echo "<p style='color: green;'>✓ Éxito: Se obtuvieron " . count($result['data']) . " reservas</p>";
        
        if (count($result['data']) > 0) {
            $firstReserva = $result['data'][0];
            echo "<p>Primera reserva ID: " . $firstReserva['id_reserva'] . "</p>";
            
            echo "<h2>2. Probando obtener reserva específica (ID: " . $firstReserva['id_reserva'] . "):</h2>";
            $singleResult = $reservaModel->getById($firstReserva['id_reserva']);
            
            if ($singleResult['success']) {
                echo "<p style='color: green;'>✓ Éxito: Reserva obtenida correctamente</p>";
                echo "<pre>" . print_r($singleResult['data'], true) . "</pre>";
            } else {
                echo "<p style='color: red;'>✗ Error: " . $singleResult['message'] . "</p>";
            }
        } else {
            echo "<p style='color: orange;'>⚠ No hay reservas en la base de datos para probar</p>";
        }
    } else {
        echo "<p style='color: red;'>✗ Error al obtener reservas: " . $result['message'] . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Excepción: " . $e->getMessage() . "</p>";
}

echo "<h2>3. Información del sistema:</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Base URL: " . (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'N/A') . "</p>";
echo "<p>Request URI: " . (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : 'N/A') . "</p>";
echo "<p>Request Method: " . (isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'N/A') . "</p>";
?>
