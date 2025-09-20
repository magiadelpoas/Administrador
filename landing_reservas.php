<?php
/**
 * Endpoint simple para reservas del landing page
 * Maneja peticiones POST sin autenticación
 */

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

// Manejar peticiones OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Solo se permite POST.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

try {
    // Incluir las clases necesarias
    require_once __DIR__ . '/models/ReservaLanding.php';
    
    // Crear instancia del modelo
    $reservaLanding = new ReservaLanding();
    
    // Obtener datos
    $data = $_POST;
    $files = $_FILES ?? [];
    
    // Crear reserva
    $result = $reservaLanding->createFromLanding($data, $files);
    
    if ($result['success']) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => $result['message'],
            'data' => $result['data'],
            'timestamp' => date('Y-m-d H:i:s'),
            'api_version' => '1.0'
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $result['message'],
            'timestamp' => date('Y-m-d H:i:s'),
            'api_version' => '1.0'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error en landing_reservas.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'timestamp' => date('Y-m-d H:i:s'),
        'api_version' => '1.0'
    ]);
}
?>
