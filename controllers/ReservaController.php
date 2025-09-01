<?php
/**
 * Controlador de Reservas
 * Maneja todas las peticiones HTTP relacionadas con reservas
 * Implementa endpoints RESTful siguiendo las mejores prácticas
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../models/Reserva.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Validator.php';

class ReservaController {
    
    private $reservaModel;
    
    /**
     * Constructor - Inicializa el modelo de reserva
     */
    public function __construct() {
        $this->reservaModel = new Reserva();
    }
    
    /**
     * GET /api/reservas - Obtiene todas las reservas con paginación
     * Requiere autenticación
     */
    public function index() {
        AuthMiddleware::requireAuth(function() {
            // Obtener parámetros de query
            $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
            $limit = isset($_GET['limit']) ? min(Config::MAX_RESULTS_PER_PAGE, max(1, intval($_GET['limit']))) : Config::DEFAULT_RESULTS_PER_PAGE;
            $search = $_GET['search'] ?? '';
            
            // Obtener reservas
            $result = $this->reservaModel->getAll($page, $limit, $search);
            
            if ($result['success']) {
                Response::paginated($result, 'Reservas obtenidas exitosamente');
            } else {
                Response::error($result['message'], 500);
            }
        });
    }
    
    /**
     * GET /api/reservas/{id} - Obtiene una reserva específica
     * Requiere autenticación
     */
    public function show($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de reserva inválido', 400);
                return;
            }
            
            $result = $this->reservaModel->getById($id);
            
            if ($result['success']) {
                Response::success($result['data'], 'Reserva obtenida exitosamente');
            } else {
                Response::notFound('Reserva');
            }
        });
    }
    
    /**
     * POST /api/reservas - Crea una nueva reserva
     * Requiere autenticación
     */
    public function store() {
        AuthMiddleware::requireAuth(function() {
            // Verificar si es una petición multipart/form-data
            if (isset($_FILES) && !empty($_FILES)) {
                // Procesar datos de formulario con archivos
                $data = $_POST;
                $files = $_FILES;
                
            } else {
                // Procesar datos JSON
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (!$input) {
                    Response::error('Datos JSON inválidos', 400);
                    return;
                }
                
                $data = $input;
                $files = [];
                

            }
            
            // Mapear campos del frontend a la base de datos
            $mappedData = $this->mapFrontendToDatabase($data);
            
            // Validar datos
            $validationErrors = $this->validateReservaData($mappedData);
            if (!empty($validationErrors)) {
                Response::validationError($validationErrors);
                return;
            }
            
            // Crear reserva
            $result = $this->reservaModel->create($mappedData, $files);
            
            if ($result['success']) {
                Response::success($result['data'], $result['message'], 201);
            } else {
                Response::error($result['message'], 400);
            }
        });
    }
    
    /**
     * PUT /api/reservas/{id} - Actualiza una reserva existente
     * Requiere autenticación
     */
    public function update($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de reserva inválido', 400);
                return;
            }
            
            // Verificar si es una petición multipart/form-data
            if (isset($_FILES) && !empty($_FILES)) {
                // Procesar datos de formulario con archivos
                $data = $_POST;
                $files = $_FILES;
            } else {
                // Procesar datos JSON
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (!$input) {
                    Response::error('Datos JSON inválidos', 400);
                    return;
                }
                
                $data = $input;
                $files = [];
            }
            
            // Mapear campos del frontend a la base de datos
            $mappedData = $this->mapFrontendToDatabase($data);
            
            // Validar datos
            $validationErrors = $this->validateReservaData($mappedData, true);
            if (!empty($validationErrors)) {
                Response::validationError($validationErrors);
                return;
            }
            
            // Actualizar reserva
            $result = $this->reservaModel->update($id, $mappedData, $files);
            
            if ($result['success']) {
                $responseData = [
                    'message' => $result['message'],
                    'changes' => $result['changes'] ?? 0
                ];
                Response::success($responseData, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrada') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * DELETE /api/reservas/{id} - Elimina una reserva (cambia estado a cancelado)
     * Requiere autenticación
     */
    public function destroy($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de reserva inválido', 400);
                return;
            }
            
            // Eliminar reserva
            $result = $this->reservaModel->delete($id);
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrada') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * PATCH /api/reservas/{id}/confirmar - Confirma una reserva (cambia estado a confirmado)
     * Requiere autenticación
     */
    public function confirmar($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de reserva inválido', 400);
                return;
            }
            
            // Confirmar reserva
            $result = $this->reservaModel->updateStatus($id, 'confirmado');
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrada') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * PATCH /api/reservas/{id}/cancelar - Cancela una reserva (cambia estado a cancelado)
     * Requiere autenticación
     */
    public function cancelar($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de reserva inválido', 400);
                return;
            }
            
            // Cancelar reserva
            $result = $this->reservaModel->updateStatus($id, 'cancelado');
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrada') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * PATCH /api/reservas/{id}/reactivar - Reactiva una reserva (cambia estado a pendiente)
     * Requiere autenticación
     */
    public function reactivar($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de reserva inválido', 400);
                return;
            }
            
            // Reactivar reserva
            $result = $this->reservaModel->updateStatus($id, 'pendiente');
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrada') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * Mapea los campos del frontend a los campos de la base de datos
     * @param array $data Datos del frontend
     * @return array Datos mapeados para la base de datos
     */
    private function mapFrontendToDatabase($data) {
        $mapped = [];
        
        // Mapeo directo de campos (soporta ambos formatos: con y sin caracteres especiales)
        $fieldMapping = [
            'cabanaId' => 'cabanaId_reserva',
            'cabanaNombre' => 'cabanaNombre_reserva',
            'cabanaColor' => 'cabanaColor_reserva',
            'cabañaId' => 'cabanaId_reserva',
            'cabañaNombre' => 'cabanaNombre_reserva',
            'cabañaColor' => 'cabanaColor_reserva',
            'nombreCliente' => 'nombreCliente_reserva',
            'emailCliente' => 'emailCliente_reserva',
            'nacionalidad' => 'nacionalidad_reserva',
            'mascotas' => 'mascotas_reserva',
            'cantidadPersonas' => 'cantidadPersonas_reserva',
            'deposito' => 'deposito_reserva',
            'moneda' => 'moneda_reserva',
            'totalDepositado' => 'totalDepositado_reserva',
            'horaIngreso' => 'horaIngreso_reserva',
            'horaSalida' => 'horaSalida_reserva',
            'fechaIngreso' => 'fechaIngreso_reserva',
            'fechaSalida' => 'fechaSalida_reserva',
            'tipoPagoPrimerDeposito' => 'tipoPagoPrimerDeposito_reserva',
            'tipoPagoSegundoDeposito' => 'tipoPagoSegundoDeposito_reserva',
            'tipoReserva' => 'tipoReserva_reserva',
            'extras' => 'extras_reserva',
            'isEdit' => 'isEdit_reserva'
        ];
        
        foreach ($fieldMapping as $frontendField => $dbField) {
            if (isset($data[$frontendField])) {
                $mapped[$dbField] = $data[$frontendField];
            }
        }
        
        // Procesar extras si es un array
        if (isset($data['extras']) && is_array($data['extras'])) {
            $mapped['extras_reserva'] = json_encode($data['extras']);
        }
        
        return $mapped;
    }
    
    /**
     * Valida los datos de la reserva
     * @param array $data Datos a validar
     * @param bool $isUpdate Indica si es una actualización
     * @return array Array de errores de validación
     */
    private function validateReservaData($data, $isUpdate = false) {
        $errors = [];
        
        // Campos requeridos para creación
        if (!$isUpdate) {
            $requiredFields = ['cabanaId_reserva', 'nombreCliente_reserva', 'emailCliente_reserva'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    $errors[] = "El campo {$field} es requerido";
                }
            }
        }
        
        // Validar email si está presente
        if (isset($data['emailCliente_reserva']) && !empty($data['emailCliente_reserva'])) {
            if (!filter_var($data['emailCliente_reserva'], FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'El formato del email del cliente no es válido';
            }
        }
        
        // Validar fechas si están presentes
        if (isset($data['fechaIngreso_reserva']) && isset($data['fechaSalida_reserva'])) {
            if (!empty($data['fechaIngreso_reserva']) && !empty($data['fechaSalida_reserva'])) {
                $fechaIngreso = new DateTime($data['fechaIngreso_reserva']);
                $fechaSalida = new DateTime($data['fechaSalida_reserva']);
                
                if ($fechaIngreso >= $fechaSalida) {
                    $errors[] = 'La fecha de salida debe ser posterior a la fecha de ingreso';
                }
            }
        }
        
        return $errors;
    }
}
?>
