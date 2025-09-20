<?php
/**
 * Archivo de prueba para verificar que el servidor funciona
 */

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Manejar peticiones OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Respuesta simple
echo json_encode([
    'success' => true,
    'message' => 'Endpoint funcionando correctamente',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'server_info' => [
        'php_version' => phpversion(),
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'No definido',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'No definido'
    ]
]);
?>
