<?php
/**
 * Test simple para verificar el manejo de fechas
 */

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Manejar peticiones OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Obtener datos del formulario
    $data = $_POST;
    
    // Log de los datos recibidos
    error_log("=== TEST FECHAS ===");
    error_log("Datos recibidos: " . print_r($data, true));
    
    // Probar el manejo de fechas
    $fechaIngreso = '';
    $fechaSalida = '';
    
    if (isset($data['fechaIngreso']) && $data['fechaIngreso']) {
        if (is_string($data['fechaIngreso'])) {
            $fechaIngreso = $data['fechaIngreso'];
            error_log("fechaIngreso como string: " . $fechaIngreso);
        } else {
            error_log("fechaIngreso NO es string, tipo: " . gettype($data['fechaIngreso']));
        }
    }
    
    if (isset($data['fechaSalida']) && $data['fechaSalida']) {
        if (is_string($data['fechaSalida'])) {
            $fechaSalida = $data['fechaSalida'];
            error_log("fechaSalida como string: " . $fechaSalida);
        } else {
            error_log("fechaSalida NO es string, tipo: " . gettype($data['fechaSalida']));
        }
    }
    
    // Respuesta de éxito
    $response = [
        'success' => true,
        'message' => 'Test de fechas exitoso',
        'data' => [
            'fechaIngreso' => $fechaIngreso,
            'fechaSalida' => $fechaSalida,
            'tipos' => [
                'fechaIngreso_type' => isset($data['fechaIngreso']) ? gettype($data['fechaIngreso']) : 'not_set',
                'fechaSalida_type' => isset($data['fechaSalida']) ? gettype($data['fechaSalida']) : 'not_set'
            ]
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    http_response_code(200);
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    error_log("Error en test_fechas.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en test: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
