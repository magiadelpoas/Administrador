<?php
/**
 * Configuración general de la aplicación
 * Contiene todas las constantes y configuraciones globales
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

class Config {
    
    // Configuración de JWT
    const JWT_SECRET_KEY = 'MagiaDelPoas2024#SecretKey!@#$%';
    const JWT_ALGORITHM = 'HS256';
    const JWT_EXPIRATION_TIME = 86400; // 24 horas en segundos
    
    // Configuración de la API
    const API_VERSION = '1.0';
    const API_NAME = 'Magia del Poas API';
    const TIMEZONE = 'America/Costa_Rica';
    
    // Configuración de respuestas
    const DEFAULT_LANGUAGE = 'es';
    const MAX_RESULTS_PER_PAGE = 100;
    const DEFAULT_RESULTS_PER_PAGE = 20;
    
    // Configuración de seguridad
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOGIN_LOCKOUT_TIME = 900; // 15 minutos en segundos
    const PASSWORD_MIN_LENGTH = 8;
    
    // Configuración de caché
    const CACHE_ENABLED = true;
    const CACHE_DEFAULT_TTL = 3600; // 1 hora en segundos
    
    // Estados de administradores
    const ADMIN_STATUS_INACTIVE = 0;
    const ADMIN_STATUS_ACTIVE = 1;
    const ADMIN_STATUS_SUSPENDED = 2;
    
    // Códigos de respuesta HTTP personalizados
    const HTTP_OK = 200;
    const HTTP_CREATED = 201;
    const HTTP_BAD_REQUEST = 400;
    const HTTP_UNAUTHORIZED = 401;
    const HTTP_FORBIDDEN = 403;
    const HTTP_NOT_FOUND = 404;
    const HTTP_METHOD_NOT_ALLOWED = 405;
    const HTTP_CONFLICT = 409;
    const HTTP_UNPROCESSABLE_ENTITY = 422;
    const HTTP_INTERNAL_SERVER_ERROR = 500;
    
    /**
     * Inicializa la configuración global de la aplicación
     * @return void
     */
    public static function init() {
        // Establecer zona horaria
        date_default_timezone_set(self::TIMEZONE);
        
        // Configurar manejo de errores
        error_reporting(E_ALL);
        ini_set('display_errors', 0); // No mostrar errores en producción
        ini_set('log_errors', 1);
        
        // Configurar headers por defecto
        header('Content-Type: application/json; charset=utf-8');
        header('X-API-Version: ' . self::API_VERSION);
        header('X-Powered-By: ' . self::API_NAME);
    }
    
    /**
     * Obtiene la configuración de base de datos
     * @return array Configuración de base de datos
     */
    public static function getDatabaseConfig() {
        return [
            'host' => '151.106.110.5',
            'dbname' => 'u513634259_Admins',
            'username' => 'u513634259_Admins', // Cambiar por tus credenciales
            'password' => 'Magia**2026!',     // Cambiar por tus credenciales
            'charset' => 'utf8mb4'
        ];
    }
    
    /**
     * Verifica si estamos en modo desarrollo
     * @return bool True si estamos en desarrollo
     */
    public static function isDevelopment() {
        return defined('DEVELOPMENT') && DEVELOPMENT === true;
    }
}
?>
