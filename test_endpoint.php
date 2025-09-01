<?php
/**
 * Archivo de prueba simple para verificar endpoints
 */

// Configurar el entorno
define('DEVELOPMENT', true);
if (DEVELOPMENT) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

echo "<h1>Prueba de Endpoint</h1>";

// Mostrar información de la petición
echo "<h2>Información de la petición:</h2>";
echo "<p><strong>Método HTTP:</strong> " . $_SERVER['REQUEST_METHOD'] . "</p>";
echo "<p><strong>URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p><strong>Host:</strong> " . $_SERVER['HTTP_HOST'] . "</p>";
echo "<p><strong>User Agent:</strong> " . $_SERVER['HTTP_USER_AGENT'] . "</p>";

// Mostrar headers
echo "<h2>Headers:</h2>";
echo "<pre>";
foreach (getallheaders() as $name => $value) {
    echo "$name: $value\n";
}
echo "</pre>";

// Mostrar parámetros de la URL
echo "<h2>Parámetros de la URL:</h2>";
echo "<pre>";
print_r($_GET);
echo "</pre>";

// Mostrar información del servidor
echo "<h2>Información del servidor:</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";

// Simular una respuesta JSON
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Endpoint de prueba funcionando',
    'data' => [
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'],
        'timestamp' => date('Y-m-d H:i:s')
    ]
]);
?>
