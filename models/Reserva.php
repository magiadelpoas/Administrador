<?php
/**
 * Modelo Reserva - Maneja todas las operaciones relacionadas con reservas
 * Implementa el patrón Active Record para la tabla 'reserva_tbl'
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Config.php';

class Reserva {
    
    // Propiedades de la tabla reserva_tbl
    public $id_reserva;
    public $cabanaId_reserva;
    public $cabanaNombre_reserva;
    public $cabanaColor_reserva;
    public $nombreCliente_reserva;
    public $emailCliente_reserva;
    public $nacionalidad_reserva;
    public $mascotas_reserva;
    public $cantidadPersonas_reserva;
    public $deposito_reserva;
    public $moneda_reserva;
    public $totalDepositado_reserva;
    public $horaIngreso_reserva;
    public $horaSalida_reserva;
    public $fechaIngreso_reserva;
    public $fechaSalida_reserva;
    public $tipoPagoPrimerDeposito_reserva;
    public $tipoPagoSegundoDeposito_reserva;
    public $tipoReserva_reserva;
    public $extras_reserva;
    public $primerDeposito_reserva;
    public $segundoDeposito_reserva;
    public $isEdit_reserva;
    public $estado_reserva;
    
    // Conexión a la base de datos
    private $db;
    private $table_name = 'reserva_tbl';
    
    /**
     * Constructor - Inicializa la conexión a la base de datos
     */
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Obtiene todas las reservas con paginación
     * @param int $page Número de página
     * @param int $limit Límite de resultados por página
     * @param string $search Término de búsqueda (opcional)
     * @return array Array con las reservas y metadatos de paginación
     */
    public function getAll($page = 1, $limit = 20, $search = '') {
        try {
            $offset = ($page - 1) * $limit;
            
            // Construir consulta base
            $baseQuery = "FROM {$this->table_name} WHERE 1=1";
            $params = [];
            
            // Agregar búsqueda si se proporciona
            if (!empty($search)) {
                $baseQuery .= " AND (nombreCliente_reserva LIKE :search OR emailCliente_reserva LIKE :search OR cabanaNombre_reserva LIKE :search)";
                $params[':search'] = "%{$search}%";
            }
            
            // Contar total de registros
            $countQuery = "SELECT COUNT(*) as total " . $baseQuery;
            $countStmt = $this->db->prepare($countQuery);
            $countStmt->execute($params);
            $totalRecords = $countStmt->fetch()['total'];
            
            // Obtener registros con paginación
            $query = "SELECT * " . $baseQuery . " ORDER BY id_reserva DESC LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($query);
            
            // Bind parámetros
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            
            $stmt->execute();
            $reservas = $stmt->fetchAll();
            
            return [
                'success' => true,
                'data' => $reservas,
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
                'message' => 'Error al obtener las reservas',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Obtiene una reserva por ID
     * @param int $id ID de la reserva
     * @return array Resultado de la operación
     */
    public function getById($id) {
        try {
            $query = "SELECT * FROM {$this->table_name} WHERE id_reserva = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $reserva = $stmt->fetch();
            
            if ($reserva) {
                return [
                    'success' => true,
                    'data' => $reserva
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Reserva no encontrada'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en getById(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al obtener la reserva',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Crea una nueva reserva
     * @param array $data Datos de la reserva
     * @param array $files Archivos subidos (opcional)
     * @return array Resultado de la operación
     */
    public function create($data, $files = []) {
        try {
            // Validar datos requeridos
            $requiredFields = ['cabanaId_reserva', 'nombreCliente_reserva', 'emailCliente_reserva'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    return [
                        'success' => false,
                        'message' => "El campo {$field} es requerido"
                    ];
                }
            }
            
            // Procesar archivos si existen
            $primerDeposito = '';
            $segundoDeposito = '';
            
            if (!empty($files['primerDeposito'])) {
                $primerDeposito = $this->uploadFile($files['primerDeposito'], 'primer');
            }
            
            if (!empty($files['segundoDeposito'])) {
                $segundoDeposito = $this->uploadFile($files['segundoDeposito'], 'segundo');
            }
            
            $query = "INSERT INTO {$this->table_name} 
                     (cabanaId_reserva, cabanaNombre_reserva, cabanaColor_reserva, 
                      nombreCliente_reserva, emailCliente_reserva, nacionalidad_reserva, 
                      mascotas_reserva, cantidadPersonas_reserva, deposito_reserva, 
                      moneda_reserva, totalDepositado_reserva, horaIngreso_reserva, 
                      horaSalida_reserva, fechaIngreso_reserva, fechaSalida_reserva, 
                      tipoPagoPrimerDeposito_reserva, tipoPagoSegundoDeposito_reserva, 
                      tipoReserva_reserva, extras_reserva, primerDeposito_reserva, 
                      segundoDeposito_reserva, isEdit_reserva, estado_reserva) 
                     VALUES 
                     (:cabanaId, :cabanaNombre, :cabanaColor, :nombreCliente, :emailCliente, 
                      :nacionalidad, :mascotas, :cantidadPersonas, :deposito, :moneda, 
                      :totalDepositado, :horaIngreso, :horaSalida, :fechaIngreso, :fechaSalida, 
                      :tipoPagoPrimer, :tipoPagoSegundo, :tipoReserva, :extras, :primerDeposito, 
                      :segundoDeposito, :isEdit, :estado)";
            
            $stmt = $this->db->prepare($query);
            
            // Bind parámetros
            $stmt->bindValue(':cabanaId', $data['cabanaId_reserva']);
            $stmt->bindValue(':cabanaNombre', $data['cabanaNombre_reserva'] ?? '');
            $stmt->bindValue(':cabanaColor', $data['cabanaColor_reserva'] ?? '');
            $stmt->bindValue(':nombreCliente', $data['nombreCliente_reserva']);
            $stmt->bindValue(':emailCliente', $data['emailCliente_reserva']);
            $stmt->bindValue(':nacionalidad', $data['nacionalidad_reserva'] ?? '');
            $stmt->bindValue(':mascotas', $data['mascotas_reserva'] ?? '');
            $stmt->bindValue(':cantidadPersonas', $data['cantidadPersonas_reserva'] ?? '');
            $stmt->bindValue(':deposito', $data['deposito_reserva'] ?? '');
            $stmt->bindValue(':moneda', $data['moneda_reserva'] ?? '');
            $stmt->bindValue(':totalDepositado', $data['totalDepositado_reserva'] ?? '');
            $stmt->bindValue(':horaIngreso', $data['horaIngreso_reserva'] ?? '');
            $stmt->bindValue(':horaSalida', $data['horaSalida_reserva'] ?? '');
            $stmt->bindValue(':fechaIngreso', $data['fechaIngreso_reserva'] ?? '');
            $stmt->bindValue(':fechaSalida', $data['fechaSalida_reserva'] ?? '');
            $stmt->bindValue(':tipoPagoPrimer', $data['tipoPagoPrimerDeposito_reserva'] ?? '');
            $stmt->bindValue(':tipoPagoSegundo', $data['tipoPagoSegundoDeposito_reserva'] ?? '');
            $stmt->bindValue(':tipoReserva', $data['tipoReserva_reserva'] ?? '');
            $stmt->bindValue(':extras', $data['extras_reserva'] ?? '');
            $stmt->bindValue(':primerDeposito', $primerDeposito);
            $stmt->bindValue(':segundoDeposito', $segundoDeposito);
            $stmt->bindValue(':isEdit', $data['isEdit_reserva'] ?? 'false');
            $stmt->bindValue(':estado', 'pendiente');
            
            if ($stmt->execute()) {
                $newId = $this->db->lastInsertId();
                return [
                    'success' => true,
                    'message' => 'Reserva creada exitosamente',
                    'data' => ['id_reserva' => $newId]
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en create(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al crear la reserva',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Actualiza una reserva existente
     * @param int $id ID de la reserva
     * @param array $data Datos a actualizar
     * @param array $files Archivos subidos (opcional)
     * @return array Resultado de la operación
     */
    public function update($id, $data, $files = []) {
        try {
            // Verificar si la reserva existe
            $existingReserva = $this->getById($id);
            if (!$existingReserva['success']) {
                return $existingReserva;
            }
            
            // Procesar archivos si existen
            $primerDeposito = $existingReserva['data']['primerDeposito_reserva'];
            $segundoDeposito = $existingReserva['data']['segundoDeposito_reserva'];
            
            if (!empty($files['primerDeposito'])) {
                $primerDeposito = $this->uploadFile($files['primerDeposito'], 'primer');
            }
            
            if (!empty($files['segundoDeposito'])) {
                $segundoDeposito = $this->uploadFile($files['segundoDeposito'], 'segundo');
            }
            
            // Construir query dinámicamente
            $updateFields = [];
            $params = [':id' => $id];
            
            $allowedFields = [
                'cabanaId_reserva', 'cabanaNombre_reserva', 'cabanaColor_reserva',
                'nombreCliente_reserva', 'emailCliente_reserva', 'nacionalidad_reserva',
                'mascotas_reserva', 'cantidadPersonas_reserva', 'deposito_reserva',
                'moneda_reserva', 'totalDepositado_reserva', 'horaIngreso_reserva',
                'horaSalida_reserva', 'fechaIngreso_reserva', 'fechaSalida_reserva',
                'tipoPagoPrimerDeposito_reserva', 'tipoPagoSegundoDeposito_reserva',
                'tipoReserva_reserva', 'extras_reserva', 'estado_reserva'
            ];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "{$field} = :{$field}";
                    $params[":{$field}"] = $data[$field];
                }
            }
            
            // Agregar campos de archivos
            $updateFields[] = "primerDeposito_reserva = :primerDeposito";
            $updateFields[] = "segundoDeposito_reserva = :segundoDeposito";
            $params[':primerDeposito'] = $primerDeposito;
            $params[':segundoDeposito'] = $segundoDeposito;
            
            if (empty($updateFields)) {
                return [
                    'success' => false,
                    'message' => 'No hay campos para actualizar'
                ];
            }
            
            $query = "UPDATE {$this->table_name} SET " . implode(', ', $updateFields) . " WHERE id_reserva = :id";
            
            $stmt = $this->db->prepare($query);
            
            if ($stmt->execute($params)) {
                return [
                    'success' => true,
                    'message' => 'Reserva actualizada exitosamente'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en update(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al actualizar la reserva',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Elimina una reserva (cambia estado a cancelado)
     * @param int $id ID de la reserva
     * @return array Resultado de la operación
     */
    public function delete($id) {
        try {
            // Verificar si la reserva existe
            $existingReserva = $this->getById($id);
            if (!$existingReserva['success']) {
                return $existingReserva;
            }
            
            // Soft delete - cambiar estado a cancelado
            $query = "UPDATE {$this->table_name} SET estado_reserva = 'cancelado' WHERE id_reserva = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Reserva cancelada exitosamente'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en delete(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al cancelar la reserva',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Actualiza el estado de una reserva
     * @param int $id ID de la reserva
     * @param string $estado Nuevo estado ('pendiente', 'confirmado', 'cancelado')
     * @return array Resultado de la operación
     */
    public function updateStatus($id, $estado) {
        try {
            // Verificar si la reserva existe
            $existingReserva = $this->getById($id);
            if (!$existingReserva['success']) {
                return [
                    'success' => false,
                    'message' => 'Reserva no encontrada'
                ];
            }
            
            // Validar estados permitidos
            $allowedStates = ['pendiente', 'confirmado', 'cancelado'];
            if (!in_array($estado, $allowedStates)) {
                return [
                    'success' => false,
                    'message' => 'Estado no válido. Estados permitidos: ' . implode(', ', $allowedStates)
                ];
            }
            
            // Obtener el estado actual
            $estadoActual = $existingReserva['data']['estado_reserva'];
            
            // Validar transiciones de estado
            $result = $this->validateStateTransition($estadoActual, $estado);
            if (!$result['valid']) {
                return [
                    'success' => false,
                    'message' => $result['message']
                ];
            }
            
            // Actualizar estado
            $query = "UPDATE {$this->table_name} SET estado_reserva = :estado WHERE id_reserva = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':estado', $estado);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                $messages = [
                    'pendiente' => 'Reserva reactivada exitosamente',
                    'confirmado' => 'Reserva confirmada exitosamente',
                    'cancelado' => 'Reserva cancelada exitosamente'
                ];
                
                return [
                    'success' => true,
                    'message' => $messages[$estado] ?? 'Estado actualizado exitosamente'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Error al actualizar el estado de la reserva'
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en updateStatus(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al actualizar el estado de la reserva',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Valida las transiciones de estado permitidas
     * @param string $estadoActual Estado actual de la reserva
     * @param string $nuevoEstado Nuevo estado deseado
     * @return array Resultado de la validación
     */
    private function validateStateTransition($estadoActual, $nuevoEstado) {
        // Definir transiciones permitidas
        $allowedTransitions = [
            'pendiente' => ['confirmado', 'cancelado'],
            'cancelado' => ['pendiente'],
            'confirmado' => [] // Una vez confirmado, no se puede cambiar
        ];
        
        // Si el estado es el mismo, no hay problema
        if ($estadoActual === $nuevoEstado) {
            return [
                'valid' => true,
                'message' => 'El estado ya es ' . $nuevoEstado
            ];
        }
        
        // Verificar si la transición está permitida
        if (!isset($allowedTransitions[$estadoActual])) {
            return [
                'valid' => false,
                'message' => 'Estado actual no reconocido: ' . $estadoActual
            ];
        }
        
        if (!in_array($nuevoEstado, $allowedTransitions[$estadoActual])) {
            $messages = [
                'confirmado' => 'No se puede cambiar el estado de una reserva confirmada',
                'pendiente' => 'Solo se puede cambiar a confirmado o cancelado desde pendiente',
                'cancelado' => 'Solo se puede reactivar (cambiar a pendiente) desde cancelado'
            ];
            
            return [
                'valid' => false,
                'message' => $messages[$estadoActual] ?? 'Transición de estado no permitida'
            ];
        }
        
        return [
            'valid' => true,
            'message' => 'Transición válida'
        ];
    }
    
    /**
     * Sube un archivo al servidor
     * @param array $file Archivo subido
     * @param string $tipo Tipo de depósito ('primer' o 'segundo')
     * @return string Nombre del archivo guardado
     */
    private function uploadFile($file, $tipo) {
        try {
            // Validar que el archivo existe y no hay errores
            if (!isset($file) || empty($file) || $file['error'] !== UPLOAD_ERR_OK) {
                return '';
            }
            
            // Validar que el archivo no esté vacío
            if ($file['size'] === 0) {
                return '';
            }
            
            // Crear directorio si no existe
            $uploadDir = __DIR__ . '/../imgComprobantes/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Validar tipos de archivo permitidos
            $allowedTypes = [
                'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            // Obtener tipo MIME del archivo
            $fileType = mime_content_type($file['tmp_name']);
            
            // Validar extensión del archivo como respaldo
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'];
            
            if (!in_array($fileType, $allowedTypes) && !in_array($extension, $allowedExtensions)) {
                return '';
            }
            
            // Generar nombre único para el archivo
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $randomId = uniqid() . '_' . time();
            $fileName = "{$tipo}_deposito_{$randomId}.{$extension}";
            $filePath = $uploadDir . $fileName;
            
            // Mover archivo
            // Intentar move_uploaded_file primero (para archivos reales)
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                return $fileName;
            } 
            // Si falla, intentar copy (para archivos de prueba o archivos que ya existen)
            else if (copy($file['tmp_name'], $filePath)) {
                return $fileName;
            } else {
                throw new Exception('Error al mover el archivo');
            }
            
        } catch (Exception $e) {
            error_log("Error en uploadFile(): " . $e->getMessage());
            return '';
        }
    }
}
?>
