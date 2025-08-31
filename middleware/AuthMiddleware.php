<?php
/**
 * Middleware de autenticación
 * Valida los tokens JWT en las peticiones protegidas
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware {
    
    /**
     * Verifica si la petición tiene un token válido
     * @return array|null Datos del usuario si el token es válido, null si no
     */
    public static function authenticate() {
        // Obtener el header de autorización
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if (!$authHeader) {
            Response::error('Token de autorización requerido', 401);
            return null;
        }
        
        // Extraer el token del header
        $token = JWT::extractTokenFromHeader($authHeader);
        
        if (!$token) {
            Response::error('Formato de token inválido. Use: Bearer <token>', 401);
            return null;
        }
        
        // Validar el token
        $userData = JWT::getUserFromToken($token);
        
        if (!$userData) {
            Response::error('Token inválido o expirado', 401);
            return null;
        }
        
        return $userData;
    }
    
    /**
     * Middleware que requiere autenticación
     * @param callable $next Función a ejecutar si la autenticación es exitosa
     * @return mixed Resultado de la función next o respuesta de error
     */
    public static function requireAuth($next) {
        $user = self::authenticate();
        
        if ($user) {
            // Agregar los datos del usuario al contexto global
            $GLOBALS['current_user'] = $user;
            return $next();
        }
        
        // Si llegamos aquí, la autenticación falló y ya se envió la respuesta de error
        return null;
    }
    
    /**
     * Obtiene el usuario actual autenticado
     * @return array|null Datos del usuario actual
     */
    public static function getCurrentUser() {
        return $GLOBALS['current_user'] ?? null;
    }
    
    /**
     * Verifica si el usuario actual tiene permisos de administrador
     * @return bool True si es administrador
     */
    public static function isAdmin() {
        $user = self::getCurrentUser();
        return $user && isset($user['id']);
    }
}
?>
