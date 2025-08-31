<?php
/**
 * Configuración y conexión a la base de datos
 * Implementa el patrón Singleton para garantizar una sola instancia de conexión
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

class Database {
    // Configuración de la base de datos
    private $host = '151.106.110.5';   
    private $db_name = 'u513634259_Admins';
    private $username = 'u513634259_Admins'; // Cambiar por tus credenciales
    private $password = 'Magia**2026!';     // Cambiar por tus credenciales
    private $charset = 'utf8mb4';
    
    // Instancia única de la conexión
    private static $instance = null;
    private $connection;
    
    /**
     * Constructor privado para implementar Singleton
     */
    private function __construct() {
        $this->connect();
    }
    
    /**
     * Obtiene la instancia única de la base de datos
     * @return Database Instancia única de la clase
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Establece la conexión con la base de datos usando PDO
     * @return void
     */
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset}"
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            throw new Exception("Error de conexión a la base de datos", 500);
        }
    }
    
    /**
     * Obtiene la conexión PDO
     * @return PDO Conexión a la base de datos
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * Verifica si la conexión está activa
     * @return bool True si la conexión está activa
     */
    public function isConnected() {
        try {
            return $this->connection && $this->connection->query('SELECT 1');
        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Cierra la conexión a la base de datos
     * @return void
     */
    public function closeConnection() {
        $this->connection = null;
    }
    
    /**
     * Previene la clonación del objeto (patrón Singleton)
     */
    private function __clone() {}
    
    /**
     * Previene la deserialización del objeto (patrón Singleton)
     */
    public function __wakeup() {
        throw new Exception("No se puede deserializar un singleton");
    }
}
?>
