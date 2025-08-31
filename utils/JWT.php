<?php
/**
 * Utilidad para manejo de JSON Web Tokens (JWT)
 * Implementa la creación, validación y decodificación de tokens JWT
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/Config.php';

class JWT {
    
    /**
     * Genera un token JWT
     * @param array $payload Datos a incluir en el token
     * @param int $expiration Tiempo de expiración en segundos (opcional)
     * @return string Token JWT generado
     */
    public static function encode($payload, $expiration = null) {
        $header = [
            'typ' => 'JWT',
            'alg' => Config::JWT_ALGORITHM
        ];
        
        $now = time();
        $exp = $expiration ? $now + $expiration : $now + Config::JWT_EXPIRATION_TIME;
        
        $payload = array_merge($payload, [
            'iat' => $now,      // Issued at (emitido en)
            'exp' => $exp       // Expiration time (tiempo de expiración)
        ]);
        
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, Config::JWT_SECRET_KEY, true);
        $signatureEncoded = self::base64UrlEncode($signature);
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
    
    /**
     * Decodifica y valida un token JWT
     * @param string $token Token JWT a validar
     * @return array|false Payload del token si es válido, false si no
     */
    public static function decode($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        [$headerEncoded, $payloadEncoded, $signatureEncoded] = $parts;
        
        // Verificar la firma
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, Config::JWT_SECRET_KEY, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            return false;
        }
        
        // Decodificar el payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        
        if (!$payload) {
            return false;
        }
        
        // Verificar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Verifica si un token es válido
     * @param string $token Token JWT a verificar
     * @return bool True si el token es válido
     */
    public static function verify($token) {
        return self::decode($token) !== false;
    }
    
    /**
     * Extrae el token del header Authorization
     * @param string $authHeader Header de autorización
     * @return string|null Token extraído o null si no existe
     */
    public static function extractTokenFromHeader($authHeader) {
        if (!$authHeader) {
            return null;
        }
        
        // Formato esperado: "Bearer <token>"
        $parts = explode(' ', $authHeader);
        
        if (count($parts) === 2 && strtolower($parts[0]) === 'bearer') {
            return $parts[1];
        }
        
        return null;
    }
    
    /**
     * Codifica en Base64 URL-safe
     * @param string $data Datos a codificar
     * @return string Datos codificados
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Decodifica Base64 URL-safe
     * @param string $data Datos a decodificar
     * @return string Datos decodificados
     */
    private static function base64UrlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
    
    /**
     * Obtiene información del usuario desde el token
     * @param string $token Token JWT
     * @return array|null Información del usuario o null si el token es inválido
     */
    public static function getUserFromToken($token) {
        $payload = self::decode($token);
        
        if (!$payload || !isset($payload['data'])) {
            return null;
        }
        
        return $payload['data'];
    }
}
?>
