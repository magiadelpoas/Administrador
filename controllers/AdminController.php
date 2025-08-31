<?php
/**
 * Controlador de Administradores
 * Maneja todas las peticiones HTTP relacionadas con administradores
 * Implementa endpoints RESTful siguiendo las mejores prácticas
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Validator.php';

class AdminController {
    
    private $adminModel;
    
    /**
     * Constructor - Inicializa el modelo de administrador
     */
    public function __construct() {
        $this->adminModel = new Admin();
    }
    
    /**
     * GET /api/admins - Obtiene todos los administradores con paginación
     * Requiere autenticación
     */
    public function index() {
        AuthMiddleware::requireAuth(function() {
            // Obtener parámetros de query
            $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
            $limit = isset($_GET['limit']) ? min(Config::MAX_RESULTS_PER_PAGE, max(1, intval($_GET['limit']))) : Config::DEFAULT_RESULTS_PER_PAGE;
            $search = $_GET['search'] ?? '';
            
            // Obtener administradores
            $result = $this->adminModel->getAll($page, $limit, $search);
            
            if ($result['success']) {
                Response::paginated($result, 'Administradores obtenidos exitosamente');
            } else {
                Response::error($result['message'], 500);
            }
        });
    }
    
    /**
     * GET /api/admins/{id} - Obtiene un administrador específico
     * Requiere autenticación
     */
    public function show($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de administrador inválido', 400);
                return;
            }
            
            $result = $this->adminModel->getById($id);
            
            if ($result['success']) {
                Response::success($result['data'], 'Administrador obtenido exitosamente');
            } else {
                Response::notFound('Administrador');
            }
        });
    }
    
    /**
     * POST /api/admins - Crea un nuevo administrador
     * Requiere autenticación
     */
    public function store() {
        AuthMiddleware::requireAuth(function() {
            // Obtener datos del cuerpo de la petición
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::error('Datos JSON inválidos', 400);
                return;
            }
            
            // Validar datos
            $validationErrors = Validator::validateAdminData($input, false);
            if (!empty($validationErrors)) {
                Response::validationError($validationErrors);
                return;
            }
            
            // Crear administrador
            $result = $this->adminModel->create($input);
            
            if ($result['success']) {
                Response::success($result['data'], $result['message'], 201);
            } else {
                $statusCode = strpos($result['message'], 'ya está registrado') !== false ? 409 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * PUT /api/admins/{id} - Actualiza un administrador existente
     * Requiere autenticación
     */
    public function update($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de administrador inválido', 400);
                return;
            }
            
            // Obtener datos del cuerpo de la petición
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::error('Datos JSON inválidos', 400);
                return;
            }
            
            // Validar datos (para actualización)
            $validationErrors = Validator::validateAdminData($input, true);
            if (!empty($validationErrors)) {
                Response::validationError($validationErrors);
                return;
            }
            
            // Actualizar administrador
            $result = $this->adminModel->update($id, $input);
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrado') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * DELETE /api/admins/{id} - Elimina un administrador (soft delete)
     * Requiere autenticación
     */
    public function destroy($id) {
        AuthMiddleware::requireAuth(function() use ($id) {
            // Validar ID
            if (!is_numeric($id) || $id <= 0) {
                Response::error('ID de administrador inválido', 400);
                return;
            }
            
            // Verificar que no se esté eliminando a sí mismo
            $currentUser = AuthMiddleware::getCurrentUser();
            if ($currentUser && $currentUser['id'] == $id) {
                Response::error('No puedes eliminar tu propia cuenta', 400);
                return;
            }
            
            // Eliminar administrador
            $result = $this->adminModel->delete($id);
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                $statusCode = strpos($result['message'], 'no encontrado') !== false ? 404 : 400;
                Response::error($result['message'], $statusCode);
            }
        });
    }
    
    /**
     * POST /api/auth/login - Autentica un administrador
     * No requiere autenticación previa
     */
    public function login() {
        // Obtener datos del cuerpo de la petición
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            Response::error('Datos JSON inválidos', 400);
            return;
        }
        
        // Validar datos requeridos
        if (empty($input['email']) || empty($input['password'])) {
            Response::error('Email y contraseña son requeridos', 400);
            return;
        }
        
        // Validar formato de email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Formato de email inválido', 400);
            return;
        }
        
        // Autenticar
        $result = $this->adminModel->authenticate($input['email'], $input['password']);
        
        if ($result['success']) {
            Response::success($result['data'], $result['message']);
        } else {
            Response::unauthorized($result['message']);
        }
    }
    
    /**
     * POST /api/auth/logout - Cierra la sesión del administrador actual
     * Requiere autenticación
     */
    public function logout() {
        AuthMiddleware::requireAuth(function() {
            $currentUser = AuthMiddleware::getCurrentUser();
            
            if (!$currentUser) {
                Response::error('Usuario no encontrado', 400);
                return;
            }
            
            $result = $this->adminModel->logout($currentUser['id']);
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                Response::error($result['message'], 500);
            }
        });
    }
    
    /**
     * GET /api/auth/me - Obtiene información del administrador actual
     * Requiere autenticación
     */
    public function profile() {
        AuthMiddleware::requireAuth(function() {
            $currentUser = AuthMiddleware::getCurrentUser();
            
            if (!$currentUser) {
                Response::error('Usuario no encontrado', 400);
                return;
            }
            
            // Obtener información completa del usuario
            $result = $this->adminModel->getById($currentUser['id']);
            
            if ($result['success']) {
                Response::success($result['data'], 'Perfil obtenido exitosamente');
            } else {
                Response::error('Error al obtener el perfil', 500);
            }
        });
    }
    
    /**
     * PUT /api/auth/profile - Actualiza el perfil del administrador actual
     * Requiere autenticación
     */
    public function updateProfile() {
        AuthMiddleware::requireAuth(function() {
            $currentUser = AuthMiddleware::getCurrentUser();
            
            if (!$currentUser) {
                Response::error('Usuario no encontrado', 400);
                return;
            }
            
            // Obtener datos del cuerpo de la petición
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::error('Datos JSON inválidos', 400);
                return;
            }
            
            // Validar datos (para actualización)
            $validationErrors = Validator::validateAdminData($input, true);
            if (!empty($validationErrors)) {
                Response::validationError($validationErrors);
                return;
            }
            
            // Actualizar perfil
            $result = $this->adminModel->update($currentUser['id'], $input);
            
            if ($result['success']) {
                Response::success(null, $result['message']);
            } else {
                Response::error($result['message'], 400);
            }
        });
    }
    
    /**
     * GET /api/health - Endpoint de salud de la API
     * No requiere autenticación
     */
    public function health() {
        $health = [
            'status' => 'OK',
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => Config::API_VERSION,
            'database' => Database::getInstance()->isConnected() ? 'Connected' : 'Disconnected'
        ];
        
        Response::success($health, 'API funcionando correctamente');
    }
}
?>
