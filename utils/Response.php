<?php
/**
 * Utilidad para manejo de respuestas HTTP estandarizadas
 * Proporciona métodos para enviar respuestas JSON consistentes
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/Config.php';

class Response {
    
    /**
     * Envía una respuesta JSON exitosa
     * @param mixed $data Datos a enviar
     * @param string $message Mensaje de éxito (opcional)
     * @param int $statusCode Código de estado HTTP (por defecto 200)
     * @return void
     */
    public static function success($data = null, $message = 'Operación exitosa', $statusCode = 200) {
        self::sendResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s'),
            'api_version' => Config::API_VERSION
        ], $statusCode);
    }
    
    /**
     * Envía una respuesta JSON de error
     * @param string $message Mensaje de error
     * @param int $statusCode Código de estado HTTP (por defecto 400)
     * @param mixed $errors Detalles adicionales del error (opcional)
     * @return void
     */
    public static function error($message = 'Error en la operación', $statusCode = 400, $errors = null) {
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s'),
            'api_version' => Config::API_VERSION
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        self::sendResponse($response, $statusCode);
    }
    
    /**
     * Envía una respuesta con paginación
     * @param array $data Datos paginados
     * @param string $message Mensaje (opcional)
     * @param int $statusCode Código de estado HTTP (por defecto 200)
     * @return void
     */
    public static function paginated($data, $message = 'Datos obtenidos exitosamente', $statusCode = 200) {
        if (!isset($data['data']) || !isset($data['pagination'])) {
            self::error('Formato de datos paginados inválido', 500);
            return;
        }
        
        self::sendResponse([
            'success' => true,
            'message' => $message,
            'data' => $data['data'],
            'pagination' => $data['pagination'],
            'timestamp' => date('Y-m-d H:i:s'),
            'api_version' => Config::API_VERSION
        ], $statusCode);
    }
    
    /**
     * Envía una respuesta JSON genérica
     * @param array $data Datos a enviar
     * @param int $statusCode Código de estado HTTP
     * @return void
     */
    private static function sendResponse($data, $statusCode) {
        // Establecer código de respuesta HTTP
        http_response_code($statusCode);
        
        // Establecer headers
        header('Content-Type: application/json; charset=utf-8');
        header('X-API-Version: ' . Config::API_VERSION);
        
        // Enviar respuesta JSON
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        
        // Terminar ejecución
        exit;
    }
    
    /**
     * Maneja errores de validación
     * @param array $validationErrors Array de errores de validación
     * @return void
     */
    public static function validationError($validationErrors) {
        self::error('Errores de validación', 422, $validationErrors);
    }
    
    /**
     * Respuesta para método no permitido
     * @param array $allowedMethods Métodos permitidos
     * @return void
     */
    public static function methodNotAllowed($allowedMethods = []) {
        header('Allow: ' . implode(', ', $allowedMethods));
        self::error('Método no permitido', 405);
    }
    
    /**
     * Respuesta para recurso no encontrado
     * @param string $resource Nombre del recurso
     * @return void
     */
    public static function notFound($resource = 'Recurso') {
        self::error("{$resource} no encontrado", 404);
    }
    
    /**
     * Respuesta para acceso no autorizado
     * @param string $message Mensaje personalizado (opcional)
     * @return void
     */
    public static function unauthorized($message = 'Acceso no autorizado') {
        self::error($message, 401);
    }
    
    /**
     * Respuesta para acceso prohibido
     * @param string $message Mensaje personalizado (opcional)
     * @return void
     */
    public static function forbidden($message = 'Acceso prohibido') {
        self::error($message, 403);
    }
    
    /**
     * Respuesta para error interno del servidor
     * @param string $message Mensaje personalizado (opcional)
     * @return void
     */
    public static function internalError($message = 'Error interno del servidor') {
        self::error($message, 500);
    }
    
    /**
     * Respuesta para conflicto (recurso ya existe)
     * @param string $message Mensaje personalizado (opcional)
     * @return void
     */
    public static function conflict($message = 'Conflicto: el recurso ya existe') {
        self::error($message, 409);
    }
}
?>
