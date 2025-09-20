<?php
/**
 * Endpoint para reservas del landing page
 * Configurado para funcionar con https://landing.magiadelpoas.com/
 */

// Incluir el logger de errores
require_once __DIR__ . '/error_logger.php';

// Configurar headers CORS específicamente para el landing page
header('Access-Control-Allow-Origin: https://landing.magiadelpoas.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

// Manejar peticiones OPTIONS (preflight CORS)
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
    // Registrar la petición
    ErrorLogger::logRequest(
        $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
        $_SERVER['REQUEST_URI'] ?? 'Unknown',
        $_POST,
        getallheaders()
    );
    
    // Incluir configuración de base de datos
    require_once __DIR__ . '/config/Database.php';
    require_once __DIR__ . '/config/Config.php';
    
    // Inicializar configuración
    Config::init();
    
    // Obtener datos del formulario
    $data = $_POST;
    $files = $_FILES ?? [];
    
    // Log para debugging
    ErrorLogger::logInfo("=== RESERVA LANDING ENDPOINT ===");
    ErrorLogger::logInfo("Datos recibidos", $data);
    ErrorLogger::logInfo("Archivos recibidos", $files);
    
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
    
    // Mapear datos a la base de datos
    $mappedData = mapLandingData($data);
    
    // Procesar archivos
    $primerDeposito = '';
    $segundoDeposito = '';
    
    if (!empty($files['proofOfAddress'])) {
        $primerDeposito = uploadFile($files['proofOfAddress'], 'primer');
    }
    
    if (!empty($files['proofOfAddress2'])) {
        $segundoDeposito = uploadFile($files['proofOfAddress2'], 'segundo');
    }
    
    // Conectar a la base de datos
    $db = Database::getInstance()->getConnection();
    
    // Insertar en la base de datos
    $query = "INSERT INTO reserva_tbl 
             (cabanaId_reserva, cabanaNombre_reserva, cabanaColor_reserva, 
              nombreCliente_reserva, emailCliente_reserva, nacionalidad_reserva, 
              mascotas_reserva, cantidadPersonas_reserva, deposito_reserva, 
              moneda_reserva, totalDepositado_reserva, horaIngreso_reserva, 
              horaSalida_reserva, fechaIngreso_reserva, fechaSalida_reserva, 
              tipoPagoPrimerDeposito_reserva, tipoPagoSegundoDeposito_reserva, 
              tipoReserva_reserva, extras_reserva, primerDeposito_reserva, 
              segundoDeposito_reserva, isEdit_reserva, estado_reserva, telefono_reserva) 
             VALUES 
             (:cabanaId, :cabanaNombre, :cabanaColor, :nombreCliente, :emailCliente, 
              :nacionalidad, :mascotas, :cantidadPersonas, :deposito, :moneda, 
              :totalDepositado, :horaIngreso, :horaSalida, :fechaIngreso, :fechaSalida, 
              :tipoPagoPrimer, :tipoPagoSegundo, :tipoReserva, :extras, :primerDeposito, 
              :segundoDeposito, :isEdit, :estado, :telefono)";
    
    $stmt = $db->prepare($query);
    
    // Bind parámetros
    $stmt->bindValue(':cabanaId', $mappedData['cabanaId_reserva']);
    $stmt->bindValue(':cabanaNombre', $mappedData['cabanaNombre_reserva'] ?? '');
    $stmt->bindValue(':cabanaColor', $mappedData['cabanaColor_reserva'] ?? '');
    $stmt->bindValue(':nombreCliente', $mappedData['nombreCliente_reserva']);
    $stmt->bindValue(':emailCliente', $mappedData['emailCliente_reserva']);
    $stmt->bindValue(':nacionalidad', $mappedData['nacionalidad_reserva'] ?? '');
    $stmt->bindValue(':mascotas', $mappedData['mascotas_reserva'] ?? '');
    $stmt->bindValue(':cantidadPersonas', $mappedData['cantidadPersonas_reserva'] ?? '');
    $stmt->bindValue(':deposito', $mappedData['deposito_reserva'] ?? '');
    $stmt->bindValue(':moneda', $mappedData['moneda_reserva'] ?? '');
    $stmt->bindValue(':totalDepositado', $mappedData['totalDepositado_reserva'] ?? '');
    $stmt->bindValue(':horaIngreso', $mappedData['horaIngreso_reserva'] ?? '');
    $stmt->bindValue(':horaSalida', $mappedData['horaSalida_reserva'] ?? '');
    $stmt->bindValue(':fechaIngreso', $mappedData['fechaIngreso_reserva'] ?? '');
    $stmt->bindValue(':fechaSalida', $mappedData['fechaSalida_reserva'] ?? '');
    $stmt->bindValue(':tipoPagoPrimer', $mappedData['tipoPagoPrimerDeposito_reserva'] ?? '');
    $stmt->bindValue(':tipoPagoSegundo', $mappedData['tipoPagoSegundoDeposito_reserva'] ?? '');
    $stmt->bindValue(':tipoReserva', $mappedData['tipoReserva_reserva'] ?? '');
    $stmt->bindValue(':extras', $mappedData['extras_reserva'] ?? '');
    $stmt->bindValue(':primerDeposito', $primerDeposito);
    $stmt->bindValue(':segundoDeposito', $segundoDeposito);
    $stmt->bindValue(':isEdit', 'false');
    $stmt->bindValue(':estado', 'pendiente');
    $stmt->bindValue(':telefono', $mappedData['telefono_reserva'] ?? '');
    
    if ($stmt->execute()) {
        $newId = $db->lastInsertId();
        
        // Log de éxito
        ErrorLogger::logInfo("Reserva creada exitosamente", ['id' => $newId]);
        
        $response = [
            'success' => true,
            'message' => 'Reserva creada exitosamente',
            'data' => ['id_reserva' => $newId],
            'timestamp' => date('Y-m-d H:i:s'),
            'api_version' => '1.0'
        ];
        
        ErrorLogger::logResponse(201, $response);
        
        http_response_code(201);
        echo json_encode($response);
    } else {
        ErrorLogger::logError("Error al ejecutar la consulta SQL");
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al insertar en la base de datos',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
} catch (Exception $e) {
    ErrorLogger::logError("Error en landing_endpoint.php", [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    
    $response = [
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s'),
        'api_version' => '1.0'
    ];
    
    ErrorLogger::logResponse(500, $response);
    
    http_response_code(500);
    echo json_encode($response);
}

/**
 * Mapea los datos del landing a la base de datos
 */
function mapLandingData($data) {
    $mapped = [];
    
    // Mapeo de campos
    $mapped['cabanaId_reserva'] = $data['cabana'];
    $mapped['nombreCliente_reserva'] = $data['fullname'];
    $mapped['emailCliente_reserva'] = $data['email'];
    $mapped['telefono_reserva'] = $data['phone'] ?? '';
    $mapped['moneda_reserva'] = $data['currency'] ?? 'Colones';
    $mapped['totalDepositado_reserva'] = $data['totalDepositado'] ?? '';
    $mapped['cantidadPersonas_reserva'] = $data['cantidadPersonas'] ?? '2';
    $mapped['nacionalidad_reserva'] = $data['pais'] ?? 'Costa Rica';
    $mapped['deposito_reserva'] = $data['deposito'] ?? '50%';
    $mapped['mascotas_reserva'] = $data['mascotas'] ?? 'No';
    
    // Mapear fechas
    if (isset($data['fechaIngreso']) && $data['fechaIngreso']) {
        $mapped['fechaIngreso_reserva'] = $data['fechaIngreso'];
    }
    if (isset($data['fechaSalida']) && $data['fechaSalida']) {
        $mapped['fechaSalida_reserva'] = $data['fechaSalida'];
    }
    
    // Procesar extras
    if (isset($data['extras']) && is_array($data['extras'])) {
        $mapped['extras_reserva'] = json_encode($data['extras']);
    } elseif (isset($data['extras'])) {
        $mapped['extras_reserva'] = $data['extras'];
    }
    
    // Mapear cabaña a nombre y color
    $cabanaMapping = [
        '1' => ['nombre' => 'ANTÍA', 'color' => 'Estándar'],
        '2' => ['nombre' => 'LILLIAM', 'color' => 'Estándar'],
        '3' => ['nombre' => 'LUNA', 'color' => 'Deluxe'],
        '4' => ['nombre' => 'ROBLE ESCONDIDO', 'color' => 'Deluxe'],
        '5' => ['nombre' => 'GLAMPING', 'color' => 'Glamping'],
        '6' => ['nombre' => 'COLIMA', 'color' => 'Colima']
    ];
    
    if (isset($cabanaMapping[$data['cabana']])) {
        $mapped['cabanaNombre_reserva'] = $cabanaMapping[$data['cabana']]['nombre'];
        $mapped['cabanaColor_reserva'] = $cabanaMapping[$data['cabana']]['color'];
    }
    
    return $mapped;
}

/**
 * Sube un archivo al servidor
 */
function uploadFile($file, $tipo) {
    try {
        if (!isset($file) || empty($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return '';
        }
        
        if ($file['size'] === 0) {
            return '';
        }
        
        // Crear directorio si no existe
        $uploadDir = __DIR__ . '/imgComprobantes/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Validar tipos de archivo
        $allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        $fileType = mime_content_type($file['tmp_name']);
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'];
        
        if (!in_array($fileType, $allowedTypes) && !in_array($extension, $allowedExtensions)) {
            return '';
        }
        
        // Generar nombre único
        $randomId = uniqid() . '_' . time();
        $fileName = "{$tipo}_deposito_{$randomId}.{$extension}";
        $filePath = $uploadDir . $fileName;
        
        // Mover archivo
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            return $fileName;
        }
        
        return '';
        
    } catch (Exception $e) {
        error_log("Error en uploadFile(): " . $e->getMessage());
        return '';
    }
}
?>
