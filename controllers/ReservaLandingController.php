<?php
/**
 * Controlador de Reservas Landing
 * Maneja las peticiones HTTP del landing page para crear reservas sin autenticación
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../models/ReservaLanding.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class ReservaLandingController {
    
    private $reservaLandingModel;
    
    /**
     * Constructor - Inicializa el modelo de reserva landing
     */
    public function __construct() {
        $this->reservaLandingModel = new ReservaLanding();
    }
    
    /**
     * POST /api/landing/reservas - Crea una nueva reserva desde el landing page
     * NO requiere autenticación
     */
    public function create() {
        try {
            // Obtener el Content-Type
            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
            
            // Debug logging
            error_log("=== RESERVA LANDING CREATE DEBUG ===");
            error_log("Content-Type: " . $contentType);
            error_log("POST data: " . print_r($_POST, true));
            error_log("FILES data: " . print_r($_FILES, true));
            
            // Verificar si es una petición multipart/form-data o form-urlencoded
            if (strpos($contentType, 'multipart/form-data') !== false || 
                strpos($contentType, 'application/x-www-form-urlencoded') !== false || 
                !empty($_POST)) {
                // Procesar datos de formulario (con o sin archivos)
                $data = $_POST;
                $files = $_FILES ?? [];
                error_log("Procesando como FormData");
                
            } else {
                // Procesar datos JSON
                $rawInput = file_get_contents('php://input');
                error_log("Raw JSON input: " . $rawInput);
                
                if (empty($rawInput)) {
                    Response::error('No se recibieron datos', 400);
                    return;
                }
                
                $input = json_decode($rawInput, true);
                
                if ($input === null) {
                    error_log("JSON decode error: " . json_last_error_msg());
                    Response::error('Datos JSON inválidos: ' . json_last_error_msg(), 400);
                    return;
                }
                
                $data = $input;
                $files = [];
                error_log("Procesando como JSON");
            }
            
            error_log("Final data: " . print_r($data, true));
            error_log("Final files: " . print_r($files, true));
            error_log("=== END DEBUG ===");
            
            // Validar datos básicos
            $validationErrors = $this->validateLandingData($data);
            if (!empty($validationErrors)) {
                Response::validationError($validationErrors);
                return;
            }
            
            // Crear reserva
            $result = $this->reservaLandingModel->createFromLanding($data, $files);
            
            if ($result['success']) {
                Response::success($result['data'], $result['message'], 201);
            } else {
                Response::error($result['message'], 400);
            }
            
        } catch (Exception $e) {
            error_log("Error en ReservaLandingController::create(): " . $e->getMessage());
            Response::error('Error interno del servidor', 500);
        }
    }
    
    /**
     * POST /api/landing/validate-availability - Valida disponibilidad de fechas
     * NO requiere autenticación
     */
    public function validateAvailability() {
        try {
            // Obtener datos de la petición
            $input = json_decode(file_get_contents('php://input'), true);
            
            if ($input === null) {
                Response::error('Datos JSON inválidos', 400);
                return;
            }
            
            // Validar campos requeridos
            $requiredFields = ['cabanaId', 'fechaIngreso', 'fechaSalida'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field]) || empty($input[$field])) {
                    Response::error("El campo {$field} es requerido", 400);
                    return;
                }
            }
            
            // Validar disponibilidad
            $result = $this->reservaLandingModel->validateAvailability(
                $input['cabanaId'],
                $input['fechaIngreso'],
                $input['fechaSalida']
            );
            
            if ($result['available']) {
                Response::success([
                    'available' => true,
                    'message' => $result['message']
                ], 'Fechas disponibles');
            } else {
                Response::error($result['message'], 409); // 409 = Conflict
            }
            
        } catch (Exception $e) {
            error_log("Error en ReservaLandingController::validateAvailability(): " . $e->getMessage());
            Response::error('Error al validar disponibilidad', 500);
        }
    }
    
    /**
     * GET /api/landing/health - Estado del servicio landing
     * NO requiere autenticación
     */
    public function health() {
        try {
            $healthData = [
                'status' => 'OK',
                'service' => 'Reserva Landing API',
                'timestamp' => date('Y-m-d H:i:s'),
                'version' => '1.0',
                'features' => [
                    'create_reservation' => true,
                    'file_upload' => true,
                    'validation' => true,
                    'availability_check' => true
                ]
            ];
            
            Response::success($healthData, 'Servicio de reservas landing funcionando correctamente');
            
        } catch (Exception $e) {
            error_log("Error en ReservaLandingController::health(): " . $e->getMessage());
            Response::error('Error al verificar el estado del servicio', 500);
        }
    }
    
    /**
     * Valida los datos del landing page
     * @param array $data Datos a validar
     * @return array Array de errores de validación
     */
    private function validateLandingData($data) {
        $errors = [];
        
        // Campos requeridos para creación desde landing
        $requiredFields = [
            'cabana' => 'Cabaña',
            'fullname' => 'Nombre completo',
            'email' => 'Email'
        ];
        
        foreach ($requiredFields as $field => $label) {
            if (empty($data[$field])) {
                $errors[] = "El campo {$label} es requerido";
            }
        }
        
        // Validar email si está presente
        if (isset($data['email']) && !empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'El formato del email no es válido';
            }
        }
        
        // Validar fechas si están presentes
        if (isset($data['fechaIngreso']) && isset($data['fechaSalida'])) {
            if (!empty($data['fechaIngreso']) && !empty($data['fechaSalida'])) {
                // Para fechas en formato dayjs (objeto con formato)
                $fechaIngreso = null;
                $fechaSalida = null;
                
                // Si viene como string, convertir a DateTime
                if (is_string($data['fechaIngreso'])) {
                    $fechaIngreso = new DateTime($data['fechaIngreso']);
                }
                if (is_string($data['fechaSalida'])) {
                    $fechaSalida = new DateTime($data['fechaSalida']);
                }
                
                // Si viene como objeto dayjs, extraer la fecha
                if (is_array($data['fechaIngreso']) && isset($data['fechaIngreso']['$d'])) {
                    $fechaIngreso = new DateTime($data['fechaIngreso']['$d']);
                }
                if (is_array($data['fechaSalida']) && isset($data['fechaSalida']['$d'])) {
                    $fechaSalida = new DateTime($data['fechaSalida']['$d']);
                }
                
                if ($fechaIngreso && $fechaSalida && $fechaIngreso > $fechaSalida) {
                    $errors[] = 'La fecha de salida debe ser igual o posterior a la fecha de ingreso';
                }
            }
        }
        
        // Validar que se haya aceptado la declaración
        if (isset($data['declaration']) && !$data['declaration']) {
            $errors[] = 'Debe aceptar la declaración para continuar';
        }
        
        return $errors;
    }
}
?>
