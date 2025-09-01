<?php
require_once 'core/Router.php';

// Crear instancia del router
$router = new Router();

// Registrar algunas rutas de prueba
$router->get('/api/reservas/{id}', ['TestController', 'show']);

// Simular petición
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/reservas/20';

// Obtener la ruta actual
$path = $_SERVER['REQUEST_URI'];

echo "Path a buscar: $path\n\n";

// Usar reflexión para acceder a métodos privados
$reflection = new ReflectionClass($router);
$findMatchingRouteMethod = $reflection->getMethod('findMatchingRoute');
$findMatchingRouteMethod->setAccessible(true);

// Obtener las rutas registradas
$routesProperty = $reflection->getProperty('routes');
$routesProperty->setAccessible(true);
$routes = $routesProperty->getValue($router);

echo "Rutas registradas:\n";
foreach ($routes as $route) {
    echo "Método: {$route['method']}, Path: {$route['path']}, Patrón: {$route['pattern']}\n";
    
    // Probar el patrón
    if (preg_match($route['pattern'], $path, $matches)) {
        echo "  ✓ COINCIDE! Parámetros: " . implode(', ', array_slice($matches, 1)) . "\n";
    } else {
        echo "  ✗ No coincide\n";
    }
    echo "\n";
}

// Intentar encontrar la ruta
$result = $findMatchingRouteMethod->invoke($router, 'GET', $path);
if ($result) {
    echo "Ruta encontrada: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "No se encontró ruta coincidente\n";
}
?>
