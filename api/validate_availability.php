<?php
/**
 * Endpoint para validar disponibilidad de fechas
 * POST /api/validate_availability.php
 */

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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
    // Incluir configuración
    require_once __DIR__ . '/../config/Database.php';
    require_once __DIR__ . '/../config/Config.php';
    require_once __DIR__ . '/../models/ReservaLanding.php';
    
    // Inicializar configuración
    Config::init();
    
    // Obtener datos JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Datos JSON inválidos',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
    
    // Validar campos requeridos
    $requiredFields = ['cabanaId', 'fechaIngreso', 'fechaSalida'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => "El campo {$field} es requerido",
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            exit;
        }
    }
    
    // Crear instancia del modelo
    $reservaLanding = new ReservaLanding();
    
    // Validar disponibilidad
    $result = $reservaLanding->validateAvailability(
        $input['cabanaId'],
        $input['fechaIngreso'],
        $input['fechaSalida']
    );
    
    if ($result['available']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'available' => true,
            'message' => $result['message'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        http_response_code(409); // Conflict
        echo json_encode([
            'success' => false,
            'available' => false,
            'message' => $result['message'],
            'conflicts' => $result['conflicts'] ?? null,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error en validate_availability.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
