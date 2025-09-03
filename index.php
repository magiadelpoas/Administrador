<?php
/**
 * Punto de entrada principal de la API Magia del Poas
 * Inicializa la aplicación y maneja todas las peticiones HTTP
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

// Configurar el entorno de desarrollo (cambiar a false en producción)
define('DEVELOPMENT', true);

// Configurar manejo de errores
if (DEVELOPMENT) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Incluir archivos necesarios
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/config/Environment.php';
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/controllers/AdminController.php';
require_once __DIR__ . '/controllers/ReservaController.php';
require_once __DIR__ . '/utils/Response.php';

// Inicializar configuración
Config::init();

// Configuración CORS simplificada para desarrollo
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://sistema.magiadelpoas.com'
];

if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Manejar peticiones OPTIONS (preflight CORS) - ANTES de cualquier otra lógica
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'OK', 'message' => 'Preflight request handled']);
    exit;
}

try {
    // Crear instancia del router
    $router = new Router();
    
    // ========================================
    // RUTAS DE AUTENTICACIÓN
    // ========================================
    
    // POST /api/auth/login - Autenticar administrador
    $router->post('/api/auth/login', ['AdminController', 'login']);
    
    // POST /api/auth/logout - Cerrar sesión
    $router->post('/api/auth/logout', ['AdminController', 'logout']);
    
    // GET /api/auth/me - Obtener perfil actual
    $router->get('/api/auth/me', ['AdminController', 'profile']);
    
    // PUT /api/auth/profile - Actualizar perfil actual
    $router->put('/api/auth/profile', ['AdminController', 'updateProfile']);
    
    // ========================================
    // RUTAS DE ADMINISTRADORES (CRUD)
    // ========================================
    
    // GET /api/admins - Listar administradores con paginación
    $router->get('/api/admins', ['AdminController', 'index']);
    
    // GET /api/admins/{id} - Obtener administrador específico
    $router->get('/api/admins/{id}', ['AdminController', 'show']);
    
    // POST /api/admins - Crear nuevo administrador
    $router->post('/api/admins', ['AdminController', 'store']);
    
    // PUT /api/admins/{id} - Actualizar administrador
    $router->put('/api/admins/{id}', ['AdminController', 'update']);
    
    // DELETE /api/admins/{id} - Eliminar administrador
    $router->delete('/api/admins/{id}', ['AdminController', 'destroy']);
    
    // ========================================
    // RUTAS DE RESERVAS (CRUD)
    // ========================================
    
    // GET /api/reservas - Listar reservas con paginación
    $router->get('/api/reservas', ['ReservaController', 'index']);
    
    // GET /api/reservas/pendientes - Listar solo reservas pendientes
    $router->get('/api/reservas/pendientes', ['ReservaController', 'pendientes']);
    
    // GET /api/reservas/confirmadas - Listar solo reservas confirmadas
    $router->get('/api/reservas/confirmadas', ['ReservaController', 'confirmadas']);
    
    // GET /api/reservas/{id} - Obtener reserva específica
    $router->get('/api/reservas/{id}', ['ReservaController', 'show']);
    
    // POST /api/reservas - Crear nueva reserva
    $router->post('/api/reservas', ['ReservaController', 'store']);
    
    // PUT /api/reservas/{id} - Actualizar reserva
    $router->put('/api/reservas/{id}', ['ReservaController', 'update']);
    
    // DELETE /api/reservas/{id} - Eliminar reserva (cambiar estado a cancelado)
    $router->delete('/api/reservas/{id}', ['ReservaController', 'destroy']);
    
    // PATCH /api/reservas/{id}/confirmar - Confirmar reserva
    $router->patch('/api/reservas/{id}/confirmar', ['ReservaController', 'confirmar']);
    
    // PATCH /api/reservas/{id}/cancelar - Cancelar reserva
    $router->patch('/api/reservas/{id}/cancelar', ['ReservaController', 'cancelar']);
    
    // PATCH /api/reservas/{id}/reactivar - Reactivar reserva
    $router->patch('/api/reservas/{id}/reactivar', ['ReservaController', 'reactivar']);
    
    // ========================================
    // RUTAS UTILITARIAS
    // ========================================
    
    // GET /api/health - Estado de la API
    $router->get('/api/health', ['AdminController', 'health']);
    
    // GET /api/docs - Documentación de endpoints
    $router->get('/api/docs', function() use ($router) {
        $docs = [
            'api_name' => Config::API_NAME,
            'version' => Config::API_VERSION,
            'description' => 'API RESTful para gestión de administradores del sistema Magia del Poas',
            'base_url' => Environment::getBaseUrl() . '/api',
            'authentication' => [
                'type' => 'Bearer Token (JWT)',
                'header' => 'Authorization: Bearer <token>',
                'login_endpoint' => '/api/auth/login'
            ],
            'endpoints' => $router->getRoutesDocumentation(),
            'response_format' => [
                'success' => [
                    'success' => true,
                    'message' => 'Mensaje descriptivo',
                    'data' => 'Datos solicitados',
                    'timestamp' => 'Fecha y hora de la respuesta',
                    'api_version' => 'Versión de la API'
                ],
                'error' => [
                    'success' => false,
                    'message' => 'Mensaje de error',
                    'timestamp' => 'Fecha y hora de la respuesta',
                    'api_version' => 'Versión de la API'
                ]
            ],
            'status_codes' => [
                200 => 'OK - Petición exitosa',
                201 => 'Created - Recurso creado exitosamente',
                400 => 'Bad Request - Petición inválida',
                401 => 'Unauthorized - No autorizado',
                403 => 'Forbidden - Acceso prohibido',
                404 => 'Not Found - Recurso no encontrado',
                405 => 'Method Not Allowed - Método no permitido',
                409 => 'Conflict - Conflicto con el estado actual',
                422 => 'Unprocessable Entity - Errores de validación',
                500 => 'Internal Server Error - Error interno del servidor'
            ]
        ];
        
        Response::success($docs, 'Documentación de la API');
    });
    
    // GET / - Ruta raíz con información básica
    $router->get('/', function() {
        $info = [
            'api_name' => Config::API_NAME,
            'version' => Config::API_VERSION,
            'status' => 'Active',
            'timestamp' => date('Y-m-d H:i:s'),
            'documentation' => '/api/docs',
            'health_check' => '/api/health'
        ];
        
        Response::success($info, 'Bienvenido a la API de Magia del Poas');
    });
    
    // Procesar la petición
    $router->dispatch();
    
} catch (Exception $e) {
    // Manejar errores no capturados
    error_log("Error no capturado en index.php: " . $e->getMessage());
    
    if (DEVELOPMENT) {
        Response::internalError('Error: ' . $e->getMessage());
    } else {
        Response::internalError('Error interno del servidor');
    }
} catch (Error $e) {
    // Manejar errores fatales de PHP
    error_log("Error fatal en index.php: " . $e->getMessage());
    
    if (DEVELOPMENT) {
        Response::internalError('Error fatal: ' . $e->getMessage());
    } else {
        Response::internalError('Error interno del servidor');
    }
}

ini_set('display_errors', 1);
ini_set("log_errors", 1);
ini_set("error_log",  "C:/xampp/htdocs/Magia del Poas/ApiMagia/error.log");

?>