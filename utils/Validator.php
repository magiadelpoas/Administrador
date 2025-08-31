<?php
/**
 * Utilidad de validación de datos
 * Proporciona métodos para validar diferentes tipos de datos de entrada
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/Config.php';

class Validator {
    
    /**
     * Valida los datos de un administrador
     * @param array $data Datos a validar
     * @param bool $isUpdate Si es una actualización (campos opcionales)
     * @return array Array de errores de validación
     */
    public static function validateAdminData($data, $isUpdate = false) {
        $errors = [];
        
        // Validar nombre (requerido solo en creación)
        if (!$isUpdate || isset($data['name_admin'])) {
            if (empty($data['name_admin'])) {
                if (!$isUpdate) {
                    $errors['name_admin'] = 'El nombre es requerido';
                }
            } else {
                if (strlen($data['name_admin']) < 2) {
                    $errors['name_admin'] = 'El nombre debe tener al menos 2 caracteres';
                }
                if (strlen($data['name_admin']) > 50) {
                    $errors['name_admin'] = 'El nombre no puede exceder 50 caracteres';
                }
                if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $data['name_admin'])) {
                    $errors['name_admin'] = 'El nombre solo puede contener letras y espacios';
                }
            }
        }
        
        // Validar email (requerido solo en creación)
        if (!$isUpdate || isset($data['email_admin'])) {
            if (empty($data['email_admin'])) {
                if (!$isUpdate) {
                    $errors['email_admin'] = 'El email es requerido';
                }
            } else {
                if (!filter_var($data['email_admin'], FILTER_VALIDATE_EMAIL)) {
                    $errors['email_admin'] = 'El formato del email es inválido';
                }
                if (strlen($data['email_admin']) > 250) {
                    $errors['email_admin'] = 'El email no puede exceder 250 caracteres';
                }
            }
        }
        
        // Validar contraseña (requerida solo en creación)
        if (!$isUpdate || isset($data['password_admin'])) {
            if (empty($data['password_admin'])) {
                if (!$isUpdate) {
                    $errors['password_admin'] = 'La contraseña es requerida';
                }
            } else {
                if (strlen($data['password_admin']) < Config::PASSWORD_MIN_LENGTH) {
                    $errors['password_admin'] = 'La contraseña debe tener al menos ' . Config::PASSWORD_MIN_LENGTH . ' caracteres';
                }
                if (strlen($data['password_admin']) > 255) {
                    $errors['password_admin'] = 'La contraseña no puede exceder 255 caracteres';
                }
                // Validar complejidad de contraseña
                if (!self::isPasswordStrong($data['password_admin'])) {
                    $errors['password_admin'] = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
                }
            }
        }
        
        // Validar teléfono (opcional)
        if (isset($data['phone_admin']) && !empty($data['phone_admin'])) {
            if (!preg_match('/^\+?[0-9\s\-\(\)]{8,15}$/', $data['phone_admin'])) {
                $errors['phone_admin'] = 'El formato del teléfono es inválido';
            }
        }
        
        // Validar status (opcional)
        if (isset($data['status_admin'])) {
            $validStatuses = [Config::ADMIN_STATUS_INACTIVE, Config::ADMIN_STATUS_ACTIVE, Config::ADMIN_STATUS_SUSPENDED];
            if (!in_array($data['status_admin'], $validStatuses)) {
                $errors['status_admin'] = 'El status debe ser 0 (inactivo), 1 (activo) o 2 (suspendido)';
            }
        }
        
        // Validar verification (opcional)
        if (isset($data['verification_admin'])) {
            if (!is_numeric($data['verification_admin']) || $data['verification_admin'] < 0 || $data['verification_admin'] > 1) {
                $errors['verification_admin'] = 'La verificación debe ser 0 (no verificado) o 1 (verificado)';
            }
        }
        
        return $errors;
    }
    
    /**
     * Valida si una contraseña es lo suficientemente fuerte
     * @param string $password Contraseña a validar
     * @return bool True si la contraseña es fuerte
     */
    private static function isPasswordStrong($password) {
        // Al menos una mayúscula, una minúscula y un número
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', $password);
    }
    
    /**
     * Valida parámetros de paginación
     * @param array $params Parámetros a validar
     * @return array Array con parámetros validados
     */
    public static function validatePaginationParams($params) {
        $validated = [];
        
        // Validar página
        $validated['page'] = isset($params['page']) ? max(1, intval($params['page'])) : 1;
        
        // Validar límite
        if (isset($params['limit'])) {
            $limit = intval($params['limit']);
            $validated['limit'] = min(Config::MAX_RESULTS_PER_PAGE, max(1, $limit));
        } else {
            $validated['limit'] = Config::DEFAULT_RESULTS_PER_PAGE;
        }
        
        // Validar término de búsqueda
        $validated['search'] = isset($params['search']) ? trim($params['search']) : '';
        if (strlen($validated['search']) > 100) {
            $validated['search'] = substr($validated['search'], 0, 100);
        }
        
        return $validated;
    }
    
    /**
     * Valida datos de login
     * @param array $data Datos de login
     * @return array Array de errores de validación
     */
    public static function validateLoginData($data) {
        $errors = [];
        
        // Validar email
        if (empty($data['email'])) {
            $errors['email'] = 'El email es requerido';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'El formato del email es inválido';
        }
        
        // Validar contraseña
        if (empty($data['password'])) {
            $errors['password'] = 'La contraseña es requerida';
        }
        
        return $errors;
    }
    
    /**
     * Sanitiza una cadena de texto
     * @param string $input Texto a sanitizar
     * @return string Texto sanitizado
     */
    public static function sanitizeString($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Valida si un ID es válido
     * @param mixed $id ID a validar
     * @return bool True si el ID es válido
     */
    public static function isValidId($id) {
        return is_numeric($id) && $id > 0 && $id == intval($id);
    }
    
    /**
     * Valida el formato de un token JWT
     * @param string $token Token a validar
     * @return bool True si el formato es válido
     */
    public static function isValidJWTFormat($token) {
        if (empty($token)) {
            return false;
        }
        
        $parts = explode('.', $token);
        return count($parts) === 3;
    }
    
    /**
     * Valida datos JSON
     * @param string $json JSON a validar
     * @return array|null Array de datos si es válido, null si no
     */
    public static function validateJSON($json) {
        if (empty($json)) {
            return null;
        }
        
        $data = json_decode($json, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }
        
        return $data;
    }
}
?>
