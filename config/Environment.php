<?php
/**
 * Configuración de entorno
 * Maneja diferentes configuraciones según el dominio y entorno
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

class Environment {
    
    // Configuración de dominios
    const DOMAIN_LOCAL = 'apiMagia.com';
    const DOMAIN_PRODUCTION = 'api.magiadelpoas.com'; // Cambiar por tu dominio de producción
    
    /**
     * Obtiene la URL base de la API según el entorno
     * @return string URL base de la API
     */
    public static function getBaseUrl() {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        
        // Si estamos en el dominio local
        if ($host === self::DOMAIN_LOCAL) {
            return 'http://' . self::DOMAIN_LOCAL;
        }
        
        // Si estamos en producción
        if ($host === self::DOMAIN_PRODUCTION) {
            return 'https://' . self::DOMAIN_PRODUCTION;
        }
        
        // Fallback para otros entornos
        return 'http://' . $host;
    }
    
    /**
     * Verifica si estamos en el entorno local
     * @return bool True si estamos en local
     */
    public static function isLocal() {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        return $host === self::DOMAIN_LOCAL || $host === 'localhost' || $host === '127.0.0.1';
    }
    
    /**
     * Verifica si estamos en producción
     * @return bool True si estamos en producción
     */
    public static function isProduction() {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        return $host === self::DOMAIN_PRODUCTION;
    }
    
    /**
     * Obtiene la configuración de CORS según el entorno
     * @return array Configuración de CORS
     */
    public static function getCorsConfig() {
        if (self::isLocal()) {
            return [
                'origin' => 'http://localhost:5173, http://127.0.0.1:5173, http://localhost:3000, http://127.0.0.1:3000',
                'methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'headers' => 'Content-Type, Authorization, X-Requested-With'
            ];
        }
        
        // En producción, especificar dominios permitidos
        return [
            'origin' => 'https://sistema.magiadelpoas.com, https://magiadelpoas.com, https://www.magiadelpoas.com',
            'methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'headers' => 'Content-Type, Authorization, X-Requested-With'
        ];
    }
}
?>
