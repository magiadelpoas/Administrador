<?php
/**
 * Modelo Admin - Maneja todas las operaciones relacionadas con administradores
 * Implementa el patrón Active Record para la tabla 'admins'
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Config.php';
require_once __DIR__ . '/../utils/JWT.php';

class Admin {
    
    // Propiedades de la tabla admins
    public $id_admin;
    public $name_admin;
    public $password_admin;
    public $email_admin;
    public $token_admin;
    public $token_exp_admin;
    public $method_admin;
    public $verification_admin;
    public $phone_admin;
    public $status_admin;
    
    // Conexión a la base de datos
    private $db;
    private $table_name = 'admins';
    
    /**
     * Constructor - Inicializa la conexión a la base de datos
     */
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Obtiene todos los administradores con paginación
     * @param int $page Número de página
     * @param int $limit Límite de resultados por página
     * @param string $search Término de búsqueda (opcional)
     * @return array Array con los administradores y metadatos de paginación
     */
    public function getAll($page = 1, $limit = 20, $search = '') {
        try {
            $offset = ($page - 1) * $limit;
            
            // Construir consulta base
            $baseQuery = "FROM {$this->table_name} WHERE 1=1";
            $params = [];
            
            // Agregar búsqueda si se proporciona
            if (!empty($search)) {
                $baseQuery .= " AND (name_admin LIKE :search OR email_admin LIKE :search OR phone_admin LIKE :search)";
                $params[':search'] = "%{$search}%";
            }
            
            // Contar total de registros
            $countQuery = "SELECT COUNT(*) as total " . $baseQuery;
            $countStmt = $this->db->prepare($countQuery);
            $countStmt->execute($params);
            $totalRecords = $countStmt->fetch()['total'];
            
            // Obtener registros con paginación
            $query = "SELECT id_admin, name_admin, email_admin, phone_admin, status_admin, 
                            verification_admin, method_admin, 
                            DATE_FORMAT(FROM_UNIXTIME(token_exp_admin), '%Y-%m-%d %H:%i:%s') as token_expiration
                     " . $baseQuery . " 
                     ORDER BY id_admin DESC 
                     LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($query);
            
            // Bind parámetros
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            
            $stmt->execute();
            $admins = $stmt->fetchAll();
            
            return [
                'success' => true,
                'data' => $admins,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total_records' => $totalRecords,
                    'total_pages' => ceil($totalRecords / $limit),
                    'has_next' => ($page * $limit) < $totalRecords,
                    'has_prev' => $page > 1
                ]
            ];
            
        } catch (PDOException $e) {
            error_log("Error en getAll(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener los administradores',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtiene un administrador por ID
     * @param int $id ID del administrador
     * @return array Resultado de la operación
     */
    public function getById($id) {
        try {
            $query = "SELECT id_admin, name_admin, email_admin, phone_admin, status_admin, 
                            verification_admin, method_admin,
                            DATE_FORMAT(FROM_UNIXTIME(token_exp_admin), '%Y-%m-%d %H:%i:%s') as token_expiration
                     FROM {$this->table_name} 
                     WHERE id_admin = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $admin = $stmt->fetch();
            
            if ($admin) {
                return [
                    'success' => true,
                    'data' => $admin
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Administrador no encontrado'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en getById(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener el administrador',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Crea un nuevo administrador
     * @param array $data Datos del administrador
     * @return array Resultado de la operación
     */
    public function create($data) {
        try {
            // Validar datos requeridos
            $requiredFields = ['name_admin', 'email_admin', 'password_admin'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    return [
                        'success' => false,
                        'message' => "El campo {$field} es requerido"
                    ];
                }
            }
            
            // Verificar si el email ya existe
            if ($this->emailExists($data['email_admin'])) {
                return [
                    'success' => false,
                    'message' => 'El email ya está registrado'
                ];
            }
            
            // Hashear la contraseña
            $hashedPassword = password_hash($data['password_admin'], PASSWORD_BCRYPT, ['cost' => 10]);
            
            $query = "INSERT INTO {$this->table_name} 
                     (name_admin, email_admin, password_admin, phone_admin, status_admin, verification_admin) 
                     VALUES (:name_admin, :email_admin, :password_admin, :phone_admin, :status_admin, :verification_admin)";
            
            $stmt = $this->db->prepare($query);
            
            // Usar bindValue en lugar de bindParam para evitar problemas de referencia
            $stmt->bindValue(':name_admin', $data['name_admin']);
            $stmt->bindValue(':email_admin', $data['email_admin']);
            $stmt->bindValue(':password_admin', $hashedPassword);
            $stmt->bindValue(':phone_admin', $data['phone_admin'] ?? null);
            $stmt->bindValue(':status_admin', $data['status_admin'] ?? Config::ADMIN_STATUS_ACTIVE, PDO::PARAM_INT);
            $stmt->bindValue(':verification_admin', $data['verification_admin'] ?? 0, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                $newId = $this->db->lastInsertId();
                return [
                    'success' => true,
                    'message' => 'Administrador creado exitosamente',
                    'data' => ['id_admin' => $newId]
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en create(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al crear el administrador',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Actualiza un administrador existente
     * @param int $id ID del administrador
     * @param array $data Datos a actualizar
     * @return array Resultado de la operación
     */
    public function update($id, $data) {
        try {
            // Verificar si el administrador existe
            $existingAdmin = $this->getById($id);
            if (!$existingAdmin['success']) {
                return $existingAdmin;
            }
            
            // Construir query dinámicamente
            $updateFields = [];
            $params = [':id' => $id];
            
            $allowedFields = ['name_admin', 'email_admin', 'phone_admin', 'status_admin', 'verification_admin'];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "{$field} = :{$field}";
                    $params[":{$field}"] = $data[$field];
                }
            }
            
            // Manejar actualización de contraseña por separado
            if (isset($data['password_admin']) && !empty($data['password_admin'])) {
                $updateFields[] = "password_admin = :password_admin";
                $params[':password_admin'] = password_hash($data['password_admin'], PASSWORD_BCRYPT, ['cost' => 10]);
            }
            
            if (empty($updateFields)) {
                return [
                    'success' => false,
                    'message' => 'No hay campos para actualizar'
                ];
            }
            
            // Verificar email único si se está actualizando
            if (isset($data['email_admin']) && $this->emailExists($data['email_admin'], $id)) {
                return [
                    'success' => false,
                    'message' => 'El email ya está registrado por otro administrador'
                ];
            }
            
            $query = "UPDATE {$this->table_name} SET " . implode(', ', $updateFields) . " WHERE id_admin = :id";
            
            $stmt = $this->db->prepare($query);
            
            if ($stmt->execute($params)) {
                return [
                    'success' => true,
                    'message' => 'Administrador actualizado exitosamente'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en update(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al actualizar el administrador',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Elimina un administrador (soft delete cambiando status)
     * @param int $id ID del administrador
     * @return array Resultado de la operación
     */
    public function delete($id) {
        try {
            // Verificar si el administrador existe
            $existingAdmin = $this->getById($id);
            if (!$existingAdmin['success']) {
                return $existingAdmin;
            }
            
            // Soft delete - cambiar status a inactivo
            $query = "UPDATE {$this->table_name} SET status_admin = :status WHERE id_admin = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':status', Config::ADMIN_STATUS_INACTIVE, PDO::PARAM_INT);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Administrador eliminado exitosamente'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en delete(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al eliminar el administrador',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Autentica un administrador con email y contraseña
     * @param string $email Email del administrador
     * @param string $password Contraseña del administrador
     * @return array Resultado de la autenticación
     */
    public function authenticate($email, $password) {
        try {
            $query = "SELECT id_admin, name_admin, email_admin, password_admin, status_admin 
                     FROM {$this->table_name} 
                     WHERE email_admin = :email AND status_admin = :status";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':status', Config::ADMIN_STATUS_ACTIVE, PDO::PARAM_INT);
            $stmt->execute();
            
            $admin = $stmt->fetch();
            
            if (!$admin) {
                return [
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ];
            }
            
            // Verificar contraseña
            if (!password_verify($password, $admin['password_admin'])) {
                return [
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ];
            }
            
            // Generar token JWT
            $tokenPayload = [
                'data' => [
                    'id' => $admin['id_admin'],
                    'email' => $admin['email_admin'],
                    'name' => $admin['name_admin']
                ]
            ];
            
            $token = JWT::encode($tokenPayload);
            $tokenExpiration = time() + Config::JWT_EXPIRATION_TIME;
            
            // Actualizar token en la base de datos
            $this->updateToken($admin['id_admin'], $token, $tokenExpiration);
            
            return [
                'success' => true,
                'message' => 'Autenticación exitosa',
                'data' => [
                    'admin' => [
                        'id_admin' => $admin['id_admin'],
                        'name_admin' => $admin['name_admin'],
                        'email_admin' => $admin['email_admin']
                    ],
                    'token' => $token,
                    'expires_at' => date('Y-m-d H:i:s', $tokenExpiration)
                ]
            ];
            
        } catch (PDOException $e) {
            error_log("Error en authenticate(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error en la autenticación',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Actualiza el token de un administrador
     * @param int $adminId ID del administrador
     * @param string $token Token JWT
     * @param int $expiration Tiempo de expiración
     * @return bool True si se actualizó correctamente
     */
    private function updateToken($adminId, $token, $expiration) {
        try {
            $query = "UPDATE {$this->table_name} 
                     SET token_admin = :token, token_exp_admin = :expiration 
                     WHERE id_admin = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':token', $token);
            $stmt->bindValue(':expiration', $expiration, PDO::PARAM_INT);
            $stmt->bindValue(':id', $adminId, PDO::PARAM_INT);
            
            return $stmt->execute();
            
        } catch (PDOException $e) {
            error_log("Error en updateToken(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Verifica si un email ya existe en la base de datos
     * @param string $email Email a verificar
     * @param int $excludeId ID a excluir de la verificación (para updates)
     * @return bool True si el email existe
     */
    private function emailExists($email, $excludeId = null) {
        try {
            $query = "SELECT COUNT(*) as count FROM {$this->table_name} WHERE email_admin = :email";
            $params = [':email' => $email];
            
            if ($excludeId) {
                $query .= " AND id_admin != :exclude_id";
                $params[':exclude_id'] = $excludeId;
            }
            
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            
            return $stmt->fetch()['count'] > 0;
            
        } catch (PDOException $e) {
            error_log("Error en emailExists(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Cierra la sesión de un administrador (invalida el token)
     * @param int $adminId ID del administrador
     * @return array Resultado de la operación
     */
    public function logout($adminId) {
        try {
            $query = "UPDATE {$this->table_name} 
                     SET token_admin = NULL, token_exp_admin = NULL 
                     WHERE id_admin = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $adminId, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Sesión cerrada exitosamente'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en logout(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al cerrar la sesión',
                'error' => $e->getMessage()
            ];
        }
    }
}
?>
