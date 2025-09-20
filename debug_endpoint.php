<?php
/**
 * Endpoint de debugging para diagnosticar problemas de conexión
 * Registra todos los errores y peticiones
 */

// Incluir el logger de errores
require_once __DIR__ . '/error_logger.php';

// Configurar headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

// Manejar peticiones OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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
    
    // Información del servidor
    $serverInfo = [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'Unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
        'http_host' => $_SERVER['HTTP_HOST'] ?? 'Unknown',
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
        'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Unknown',
        'content_length' => $_SERVER['CONTENT_LENGTH'] ?? 'Unknown'
    ];
    
    // Verificar si es una petición POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Probar conexión a la base de datos
        $dbStatus = 'unknown';
        $dbError = '';
        
        try {
            require_once __DIR__ . '/config/Database.php';
            require_once __DIR__ . '/config/Config.php';
            
            Config::init();
            $db = Database::getInstance()->getConnection();
            $dbStatus = 'connected';
            
            // Probar una consulta simple
            $stmt = $db->query("SELECT 1 as test");
            $result = $stmt->fetch();
            $dbStatus = 'working';
            
        } catch (Exception $e) {
            $dbStatus = 'error';
            $dbError = $e->getMessage();
            ErrorLogger::logError('Database connection failed', ['error' => $e->getMessage()]);
        }
        
        // Probar escritura de archivos
        $fileStatus = 'unknown';
        $fileError = '';
        
        try {
            $testFile = __DIR__ . '/logs/test_write.txt';
            $testContent = 'Test write at ' . date('Y-m-d H:i:s');
            
            if (file_put_contents($testFile, $testContent)) {
                $fileStatus = 'working';
                unlink($testFile); // Eliminar archivo de prueba
            } else {
                $fileStatus = 'error';
                $fileError = 'Could not write to file';
            }
            
        } catch (Exception $e) {
            $fileStatus = 'error';
            $fileError = $e->getMessage();
            ErrorLogger::logError('File write test failed', ['error' => $e->getMessage()]);
        }
        
        // Respuesta de debugging
        $response = [
            'success' => true,
            'message' => 'Debug endpoint working',
            'timestamp' => date('Y-m-d H:i:s'),
            'server_info' => $serverInfo,
            'database_status' => $dbStatus,
            'database_error' => $dbError,
            'file_status' => $fileStatus,
            'file_error' => $fileError,
            'post_data' => $_POST,
            'files_data' => $_FILES,
            'headers' => getallheaders(),
            'environment' => [
                'error_reporting' => error_reporting(),
                'display_errors' => ini_get('display_errors'),
                'log_errors' => ini_get('log_errors'),
                'memory_limit' => ini_get('memory_limit'),
                'max_execution_time' => ini_get('max_execution_time'),
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size')
            ]
        ];
        
        ErrorLogger::logResponse(200, $response);
        
        http_response_code(200);
        echo json_encode($response, JSON_PRETTY_PRINT);
        
    } else {
        // Petición GET - mostrar información del servidor
        $response = [
            'success' => true,
            'message' => 'Debug endpoint accessible',
            'timestamp' => date('Y-m-d H:i:s'),
            'server_info' => $serverInfo,
            'environment' => [
                'error_reporting' => error_reporting(),
                'display_errors' => ini_get('display_errors'),
                'log_errors' => ini_get('log_errors'),
                'memory_limit' => ini_get('memory_limit'),
                'max_execution_time' => ini_get('max_execution_time'),
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size')
            ]
        ];
        
        ErrorLogger::logResponse(200, $response);
        
        http_response_code(200);
        echo json_encode($response, JSON_PRETTY_PRINT);
    }
    
} catch (Exception $e) {
    ErrorLogger::logError('Debug endpoint error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Debug endpoint error: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
?>
