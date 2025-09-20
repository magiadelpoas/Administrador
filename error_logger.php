<?php
/**
 * Sistema de logging de errores para la API
 * Registra todos los errores y peticiones para debugging
 */

class ErrorLogger {
    private static $logFile = __DIR__ . '/logs/api_errors.log';
    private static $requestLogFile = __DIR__ . '/logs/api_requests.log';
    
    public static function init() {
        // Crear directorio de logs si no existe
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        // Configurar logging de errores de PHP
        ini_set('log_errors', 1);
        ini_set('error_log', self::$logFile);
    }
    
    public static function logError($message, $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' | Context: ' . json_encode($context) : '';
        $logMessage = "[{$timestamp}] ERROR: {$message}{$contextStr}" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    public static function logRequest($method, $uri, $data = [], $headers = []) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] REQUEST: {$method} {$uri}" . PHP_EOL;
        $logMessage .= "Data: " . json_encode($data) . PHP_EOL;
        $logMessage .= "Headers: " . json_encode($headers) . PHP_EOL;
        $logMessage .= "---" . PHP_EOL;
        
        file_put_contents(self::$requestLogFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    public static function logResponse($statusCode, $response, $headers = []) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] RESPONSE: {$statusCode}" . PHP_EOL;
        $logMessage .= "Response: " . json_encode($response) . PHP_EOL;
        $logMessage .= "Headers: " . json_encode($headers) . PHP_EOL;
        $logMessage .= "---" . PHP_EOL;
        
        file_put_contents(self::$requestLogFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    public static function logInfo($message, $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' | Context: ' . json_encode($context) : '';
        $logMessage = "[{$timestamp}] INFO: {$message}{$contextStr}" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    public static function getLogs($lines = 50) {
        if (file_exists(self::$logFile)) {
            $logs = file(self::$logFile);
            return array_slice($logs, -$lines);
        }
        return [];
    }
    
    public static function getRequestLogs($lines = 50) {
        if (file_exists(self::$requestLogFile)) {
            $logs = file(self::$requestLogFile);
            return array_slice($logs, -$lines);
        }
        return [];
    }
    
    public static function clearLogs() {
        if (file_exists(self::$logFile)) {
            file_put_contents(self::$logFile, '');
        }
        if (file_exists(self::$requestLogFile)) {
            file_put_contents(self::$requestLogFile, '');
        }
    }
}

// Inicializar el logger
ErrorLogger::init();

// Registrar información del servidor
ErrorLogger::logInfo('ErrorLogger initialized', [
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
]);
?>
