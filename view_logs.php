<?php
/**
 * Endpoint para ver los logs de errores
 * Útil para debugging en producción
 */

// Incluir el logger de errores
require_once __DIR__ . '/error_logger.php';

// Configurar headers
header('Content-Type: text/plain; charset=utf-8');

// Verificar si se solicita limpiar logs
if (isset($_GET['clear']) && $_GET['clear'] === 'true') {
    ErrorLogger::clearLogs();
    echo "Logs cleared.\n\n";
}

// Mostrar logs de errores
echo "=== ERROR LOGS ===\n";
$errorLogs = ErrorLogger::getLogs(100);
if (empty($errorLogs)) {
    echo "No error logs found.\n";
} else {
    foreach ($errorLogs as $log) {
        echo $log;
    }
}

echo "\n=== REQUEST LOGS ===\n";
$requestLogs = ErrorLogger::getRequestLogs(100);
if (empty($requestLogs)) {
    echo "No request logs found.\n";
} else {
    foreach ($requestLogs as $log) {
        echo $log;
    }
}

echo "\n=== SERVER INFO ===\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "\n";
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . "\n";
echo "Script Filename: " . ($_SERVER['SCRIPT_FILENAME'] ?? 'Unknown') . "\n";
echo "Request URI: " . ($_SERVER['REQUEST_URI'] ?? 'Unknown') . "\n";
echo "HTTP Host: " . ($_SERVER['HTTP_HOST'] ?? 'Unknown') . "\n";
echo "Remote Addr: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";

echo "\n=== ENVIRONMENT ===\n";
echo "Error Reporting: " . error_reporting() . "\n";
echo "Display Errors: " . ini_get('display_errors') . "\n";
echo "Log Errors: " . ini_get('log_errors') . "\n";
echo "Memory Limit: " . ini_get('memory_limit') . "\n";
echo "Max Execution Time: " . ini_get('max_execution_time') . "\n";
echo "Upload Max Filesize: " . ini_get('upload_max_filesize') . "\n";
echo "Post Max Size: " . ini_get('post_max_size') . "\n";

echo "\n=== FILES ===\n";
echo "Current Directory: " . __DIR__ . "\n";
echo "Log Directory: " . dirname(ErrorLogger::$logFile) . "\n";
echo "Log File Exists: " . (file_exists(ErrorLogger::$logFile) ? 'Yes' : 'No') . "\n";
echo "Request Log File Exists: " . (file_exists(ErrorLogger::$requestLogFile) ? 'Yes' : 'No') . "\n";

echo "\n=== CLEAR LOGS ===\n";
echo "To clear logs, visit: " . $_SERVER['REQUEST_URI'] . "?clear=true\n";
?>
