<?php
/**
 * Sistema de enrutamiento de la API
 * Maneja el enrutamiento de peticiones HTTP a controladores específicos
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../utils/Response.php';

class Router {
    
    private $routes = [];
    private $currentRoute = null;
    
    /**
     * Registra una ruta GET
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }
    
    /**
     * Registra una ruta POST
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }
    
    /**
     * Registra una ruta PUT
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }
    
    /**
     * Registra una ruta DELETE
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    /**
     * Registra una ruta PATCH
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    public function patch($path, $handler) {
        $this->addRoute('PATCH', $path, $handler);
    }
    
    /**
     * Registra una ruta OPTIONS
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    public function options($path, $handler) {
        $this->addRoute('OPTIONS', $path, $handler);
    }
    
    /**
     * Agrega una ruta al sistema
     * @param string $method Método HTTP
     * @param string $path Ruta
     * @param callable|array $handler Manejador de la ruta
     * @return void
     */
    private function addRoute($method, $path, $handler) {
        $pattern = $this->convertPathToPattern($path);
        
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'pattern' => $pattern,
            'handler' => $handler
        ];
    }
    
    /**
     * Convierte una ruta en un patrón regex
     * @param string $path Ruta a convertir
     * @return string Patrón regex
     */
    private function convertPathToPattern($path) {
        // Método más simple y directo
        // Reemplazar {param} con ([^/]+) directamente
        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $path);
        
        // Escapar caracteres especiales de regex
        $pattern = str_replace('/', '\/', $pattern);
        
        // Debug logs removidos para producción
        
        return '/^' . $pattern . '$/';
    }
    
    /**
     * Procesa la petición actual
     * @return void
     */
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $this->getCurrentPath();
        
        // Debug logging removido para producción
        
        // Manejar peticiones OPTIONS para CORS
        if ($method === 'OPTIONS') {
            $this->handleCORS();
            return;
        }
        
        // Buscar ruta coincidente
        $matchedRoute = $this->findMatchingRoute($method, $path);
        
        if (!$matchedRoute) {
            $this->handleNotFound($method);
            return;
        }
        
        // Ejecutar el manejador de la ruta
        $this->executeHandler($matchedRoute);
    }
    
    /**
     * Obtiene la ruta actual de la petición
     * @return string Ruta actual
     */
    private function getCurrentPath() {
        $path = $_SERVER['REQUEST_URI'];
        
        // Remover query string
        if (($pos = strpos($path, '?')) !== false) {
            $path = substr($path, 0, $pos);
        }
        
        // Remover slash final si existe
        if (strlen($path) > 1 && substr($path, -1) === '/') {
            $path = rtrim($path, '/');
        }
        
        return $path;
    }
    
    /**
     * Busca una ruta que coincida con el método y path dados
     * @param string $method Método HTTP
     * @param string $path Ruta
     * @return array|null Ruta coincidente o null
     */
    private function findMatchingRoute($method, $path) {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $path, $matches)) {
                // Extraer parámetros de la ruta
                $params = array_slice($matches, 1);
                
                return [
                    'handler' => $route['handler'],
                    'params' => $params,
                    'path' => $route['path']
                ];
            }
        }
        
        return null;
    }
    
    /**
     * Ejecuta el manejador de una ruta
     * @param array $matchedRoute Ruta coincidente
     * @return void
     */
    private function executeHandler($matchedRoute) {
        $handler = $matchedRoute['handler'];
        $params = $matchedRoute['params'];
        
        try {
            if (is_callable($handler)) {
                // Ejecutar función directamente
                call_user_func_array($handler, $params);
            } elseif (is_array($handler) && count($handler) === 2) {
                // Ejecutar método de controlador [ControllerClass, method]
                [$controllerClass, $method] = $handler;
                
                if (class_exists($controllerClass)) {
                    $controller = new $controllerClass();
                    
                    if (method_exists($controller, $method)) {
                        call_user_func_array([$controller, $method], $params);
                    } else {
                        Response::internalError("Método {$method} no encontrado en {$controllerClass}");
                    }
                } else {
                    Response::internalError("Controlador {$controllerClass} no encontrado");
                }
            } else {
                Response::internalError('Manejador de ruta inválido');
            }
            
        } catch (Exception $e) {
            error_log("Error en executeHandler: " . $e->getMessage());
            Response::internalError('Error interno del servidor');
        }
    }
    
    /**
     * Maneja peticiones CORS
     * @return void
     */
    private function handleCORS() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 86400'); // 24 horas
        
        http_response_code(200);
        exit;
    }
    
    /**
     * Maneja rutas no encontradas
     * @param string $method Método HTTP de la petición
     * @return void
     */
    private function handleNotFound($method) {
        // Verificar si existe la ruta para otros métodos
        $path = $this->getCurrentPath();
        $allowedMethods = [];
        
        foreach ($this->routes as $route) {
            if (preg_match($route['pattern'], $path)) {
                $allowedMethods[] = $route['method'];
            }
        }
        
        if (!empty($allowedMethods)) {
            // Método no permitido
            Response::methodNotAllowed($allowedMethods);
        } else {
            // Ruta no encontrada
            Response::notFound('Endpoint');
        }
    }
    
    /**
     * Obtiene todas las rutas registradas
     * @return array Array de rutas
     */
    public function getRoutes() {
        return $this->routes;
    }
    
    /**
     * Genera documentación básica de las rutas
     * @return array Documentación de rutas
     */
    public function getRoutesDocumentation() {
        $docs = [];
        
        foreach ($this->routes as $route) {
            $docs[] = [
                'method' => $route['method'],
                'path' => $route['path'],
                'description' => $this->getRouteDescription($route['path'], $route['method'])
            ];
        }
        
        return $docs;
    }
    
    /**
     * Obtiene la descripción de una ruta
     * @param string $path Ruta
     * @param string $method Método HTTP
     * @return string Descripción de la ruta
     */
    private function getRouteDescription($path, $method) {
        $descriptions = [
            'GET /api/admins' => 'Obtiene lista de administradores con paginación',
            'GET /api/admins/{id}' => 'Obtiene un administrador específico',
            'POST /api/admins' => 'Crea un nuevo administrador',
            'PUT /api/admins/{id}' => 'Actualiza un administrador existente',
            'DELETE /api/admins/{id}' => 'Elimina un administrador',
            'POST /api/auth/login' => 'Autentica un administrador',
            'POST /api/auth/logout' => 'Cierra sesión del administrador actual',
            'GET /api/auth/me' => 'Obtiene perfil del administrador actual',
            'PUT /api/auth/profile' => 'Actualiza perfil del administrador actual',
            'GET /api/health' => 'Verifica el estado de la API'
        ];
        
        $key = $method . ' ' . $path;
        return $descriptions[$key] ?? 'Endpoint de la API';
    }
}
?>
