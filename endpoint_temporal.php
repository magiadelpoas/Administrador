<?php
/**
 * Endpoint temporal para reservas del landing page
 * Funciona con la configuración actual del servidor
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
    // Simular procesamiento de reserva (sin base de datos por ahora)
    $data = $_POST;
    $files = $_FILES ?? [];
    
    // Validar campos requeridos
    $requiredFields = ['cabana', 'fullname', 'email'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => "El campo {$field} es requerido",
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            exit;
        }
    }
    
    // Validar email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El formato del email no es válido',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
    
    // Simular ID de reserva
    $reservaId = rand(1000, 9999);
    
    // Log de la reserva (para debugging)
    error_log("Reserva simulada creada - ID: {$reservaId}, Datos: " . print_r($data, true));
    
    // Respuesta exitosa
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Reserva creada exitosamente (modo simulación)',
        'data' => [
            'id_reserva' => $reservaId,
            'status' => 'simulation_mode',
            'note' => 'Esta es una simulación. La reserva real se procesará cuando el servidor esté configurado correctamente.'
        ],
        'timestamp' => date('Y-m-d H:i:s'),
        'api_version' => '1.0'
    ]);
    
} catch (Exception $e) {
    error_log("Error en endpoint_temporal.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s'),
        'api_version' => '1.0'
    ]);
}
?>
