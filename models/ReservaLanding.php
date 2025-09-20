<?php
/**
 * Modelo ReservaLanding - Maneja operaciones de reservas desde el landing page
 * Versión simplificada del modelo Reserva para uso público sin autenticación
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Config.php';

class ReservaLanding {
    
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
    public $telefono_reserva;
    
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
     * Crea una nueva reserva desde el landing page
     * @param array $data Datos de la reserva
     * @param array $files Archivos subidos (opcional)
     * @return array Resultado de la operación
     */
    public function createFromLanding($data, $files = []) {
        try {
            // Validar datos requeridos
            $requiredFields = ['cabana', 'fullname', 'email'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    return [
                        'success' => false,
                        'message' => "El campo {$field} es requerido"
                    ];
                }
            }
            
            // Mapear datos del frontend a la base de datos
            $mappedData = $this->mapLandingToDatabase($data);
            
            // Procesar archivos si existen
            $primerDeposito = '';
            $segundoDeposito = '';
            
            if (!empty($files['proofOfAddress'])) {
                $primerDeposito = $this->uploadFile($files['proofOfAddress'], 'primer');
            }
            
            if (!empty($files['proofOfAddress2'])) {
                $segundoDeposito = $this->uploadFile($files['proofOfAddress2'], 'segundo');
            }
            
            $query = "INSERT INTO {$this->table_name} 
                     (cabanaId_reserva, cabanaNombre_reserva, cabanaColor_reserva, 
                      nombreCliente_reserva, emailCliente_reserva, nacionalidad_reserva, 
                      mascotas_reserva, cantidadPersonas_reserva, deposito_reserva, 
                      moneda_reserva, totalDepositado_reserva, horaIngreso_reserva, 
                      horaSalida_reserva, fechaIngreso_reserva, fechaSalida_reserva, 
                      tipoPagoPrimerDeposito_reserva, tipoPagoSegundoDeposito_reserva, 
                      tipoReserva_reserva, extras_reserva, primerDeposito_reserva, 
                      segundoDeposito_reserva, isEdit_reserva, estado_reserva, telefono_reserva) 
                     VALUES 
                     (:cabanaId, :cabanaNombre, :cabanaColor, :nombreCliente, :emailCliente, 
                      :nacionalidad, :mascotas, :cantidadPersonas, :deposito, :moneda, 
                      :totalDepositado, :horaIngreso, :horaSalida, :fechaIngreso, :fechaSalida, 
                      :tipoPagoPrimer, :tipoPagoSegundo, :tipoReserva, :extras, :primerDeposito, 
                      :segundoDeposito, :isEdit, :estado, :telefono)";
            
            $stmt = $this->db->prepare($query);
            
            // Bind parámetros
            $stmt->bindValue(':cabanaId', $mappedData['cabanaId_reserva']);
            $stmt->bindValue(':cabanaNombre', $mappedData['cabanaNombre_reserva'] ?? '');
            $stmt->bindValue(':cabanaColor', $mappedData['cabanaColor_reserva'] ?? '');
            $stmt->bindValue(':nombreCliente', $mappedData['nombreCliente_reserva']);
            $stmt->bindValue(':emailCliente', $mappedData['emailCliente_reserva']);
            $stmt->bindValue(':nacionalidad', $mappedData['nacionalidad_reserva'] ?? '');
            $stmt->bindValue(':mascotas', $mappedData['mascotas_reserva'] ?? '');
            $stmt->bindValue(':cantidadPersonas', $mappedData['cantidadPersonas_reserva'] ?? '');
            $stmt->bindValue(':deposito', $mappedData['deposito_reserva'] ?? '');
            $stmt->bindValue(':moneda', $mappedData['moneda_reserva'] ?? '');
            $stmt->bindValue(':totalDepositado', $mappedData['totalDepositado_reserva'] ?? '');
            $stmt->bindValue(':horaIngreso', $mappedData['horaIngreso_reserva'] ?? '');
            $stmt->bindValue(':horaSalida', $mappedData['horaSalida_reserva'] ?? '');
            $stmt->bindValue(':fechaIngreso', $mappedData['fechaIngreso_reserva'] ?? '');
            $stmt->bindValue(':fechaSalida', $mappedData['fechaSalida_reserva'] ?? '');
            $stmt->bindValue(':tipoPagoPrimer', $mappedData['tipoPagoPrimerDeposito_reserva'] ?? '');
            $stmt->bindValue(':tipoPagoSegundo', $mappedData['tipoPagoSegundoDeposito_reserva'] ?? '');
            $stmt->bindValue(':tipoReserva', $mappedData['tipoReserva_reserva'] ?? '');
            $stmt->bindValue(':extras', $mappedData['extras_reserva'] ?? '');
            $stmt->bindValue(':primerDeposito', $primerDeposito);
            $stmt->bindValue(':segundoDeposito', $segundoDeposito);
            $stmt->bindValue(':isEdit', 'false');
            $stmt->bindValue(':estado', 'pendiente');
            $stmt->bindValue(':telefono', $mappedData['telefono_reserva'] ?? '');
            
            if ($stmt->execute()) {
                $newId = $this->db->lastInsertId();
                return [
                    'success' => true,
                    'message' => 'Reserva creada exitosamente desde el landing page',
                    'data' => ['id_reserva' => $newId]
                ];
            }
            
        } catch (PDOException $e) {
            error_log("Error en createFromLanding(): " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al crear la reserva',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Mapea los datos del landing page a los campos de la base de datos
     * @param array $data Datos del landing page
     * @return array Datos mapeados para la base de datos
     */
    private function mapLandingToDatabase($data) {
        $mapped = [];
        
        // Mapeo de campos del frontend a la base de datos
        $fieldMapping = [
            'cabana' => 'cabanaId_reserva',
            'fullname' => 'nombreCliente_reserva',
            'email' => 'emailCliente_reserva',
            'phone' => 'telefono_reserva',
            'currency' => 'moneda_reserva',
            'totalDepositado' => 'totalDepositado_reserva',
            'cantidadPersonas' => 'cantidadPersonas_reserva',
            'pais' => 'nacionalidad_reserva',
            'deposito' => 'deposito_reserva',
            'extras' => 'extras_reserva',
            'mascotas' => 'mascotas_reserva'
        ];
        
        // Mapear campos directos
        foreach ($fieldMapping as $frontendField => $dbField) {
            if (isset($data[$frontendField])) {
                $mapped[$dbField] = $data[$frontendField];
            }
        }
        
        // Mapear fechas (las fechas ya vienen como strings desde el frontend)
        if (isset($data['fechaIngreso']) && $data['fechaIngreso']) {
            // Si es un string, usarlo directamente; si es un objeto, convertir a string
            if (is_string($data['fechaIngreso'])) {
                $mapped['fechaIngreso_reserva'] = $data['fechaIngreso'];
            } else {
                $mapped['fechaIngreso_reserva'] = $data['fechaIngreso']->format('Y-m-d');
            }
        }
        
        if (isset($data['fechaSalida']) && $data['fechaSalida']) {
            // Si es un string, usarlo directamente; si es un objeto, convertir a string
            if (is_string($data['fechaSalida'])) {
                $mapped['fechaSalida_reserva'] = $data['fechaSalida'];
            } else {
                $mapped['fechaSalida_reserva'] = $data['fechaSalida']->format('Y-m-d');
            }
        }
        
        // Procesar extras si es un array
        if (isset($data['extras']) && is_array($data['extras'])) {
            $mapped['extras_reserva'] = json_encode($data['extras']);
        }
        
        // Mapear cabaña a nombre y color
        $cabanaMapping = [
            '1' => ['nombre' => 'ANTÍA', 'color' => 'Estándar'],
            '2' => ['nombre' => 'LILLIAM', 'color' => 'Estándar'],
            '3' => ['nombre' => 'LUNA', 'color' => 'Deluxe'],
            '4' => ['nombre' => 'ROBLE ESCONDIDO', 'color' => 'Deluxe'],
            '5' => ['nombre' => 'GLAMPING', 'color' => 'Glamping'],
            '6' => ['nombre' => 'COLIMA', 'color' => 'Colima']
        ];
        
        if (isset($data['cabana']) && isset($cabanaMapping[$data['cabana']])) {
            $mapped['cabanaNombre_reserva'] = $cabanaMapping[$data['cabana']]['nombre'];
            $mapped['cabanaColor_reserva'] = $cabanaMapping[$data['cabana']]['color'];
        }
        
        return $mapped;
    }
    
    /**
     * Elimina un archivo del servidor
     * @param string $fileName Nombre del archivo a eliminar
     * @return bool True si se eliminó exitosamente, false en caso contrario
     */
    private function deleteFile($fileName) {
        try {
            if (empty($fileName)) {
                return true; // No hay archivo que eliminar
            }
            
            $filePath = __DIR__ . '/../imgComprobantes/' . $fileName;
            
            if (file_exists($filePath)) {
                if (unlink($filePath)) {
                    error_log("Archivo eliminado exitosamente: {$fileName}");
                    return true;
                } else {
                    error_log("Error al eliminar archivo: {$fileName}");
                    return false;
                }
            } else {
                error_log("Archivo no encontrado para eliminar: {$fileName}");
                return true; // Consideramos éxito si el archivo ya no existe
            }
        } catch (Exception $e) {
            error_log("Error en deleteFile(): " . $e->getMessage());
            return false;
        }
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
            
            // Generar hash del archivo para detectar duplicados
            $fileHash = md5_file($file['tmp_name']);
            $fileSize = filesize($file['tmp_name']);
            
            // Buscar si ya existe un archivo idéntico
            $existingFile = $this->findExistingFile($uploadDir, $fileHash, $fileSize);
            if ($existingFile) {
                error_log("Archivo idéntico encontrado, reutilizando: {$existingFile}");
                return $existingFile;
            }
            
            // Generar nombre único para el archivo
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $randomId = uniqid() . '_' . time();
            $fileName = "{$tipo}_deposito_{$randomId}.{$extension}";
            $filePath = $uploadDir . $fileName;
            
            // Mover archivo
            // Intentar move_uploaded_file primero (para archivos reales)
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                error_log("Archivo subido exitosamente: {$fileName}");
                return $fileName;
            } 
            // Si falla, intentar copy (para archivos de prueba o archivos que ya existen)
            else if (copy($file['tmp_name'], $filePath)) {
                error_log("Archivo copiado exitosamente: {$fileName}");
                return $fileName;
            } else {
                throw new Exception('Error al mover el archivo');
            }
            
        } catch (Exception $e) {
            error_log("Error en uploadFile(): " . $e->getMessage());
            return '';
        }
    }
    
    /**
     * Valida la disponibilidad de fechas para una cabaña específica
     * @param string $cabanaId ID de la cabaña
     * @param string $fechaIngreso Fecha de ingreso (YYYY-MM-DD)
     * @param string $fechaSalida Fecha de salida (YYYY-MM-DD)
     * @return array Resultado de la validación
     */
    public function validateAvailability($cabanaId, $fechaIngreso, $fechaSalida) {
        try {
            // Validar que las fechas sean válidas
            $fechaIngresoObj = new DateTime($fechaIngreso);
            $fechaSalidaObj = new DateTime($fechaSalida);
            
            // Verificar que la fecha de salida sea posterior a la de ingreso
            if ($fechaSalidaObj <= $fechaIngresoObj) {
                return [
                    'available' => false,
                    'message' => 'La fecha de salida debe ser posterior a la fecha de ingreso'
                ];
            }
            
            // Consulta SQL para verificar conflictos de fechas
            // Un conflicto existe si:
            // 1. La fecha de ingreso del cliente está entre fechas de una reserva existente
            // 2. La fecha de salida del cliente está entre fechas de una reserva existente  
            // 3. Las fechas del cliente engloban completamente una reserva existente
            // NOTA: El mismo día de salida de una reserva = DISPONIBLE para ingreso (no es conflicto)
            $query = "SELECT id_reserva, nombreCliente_reserva, fechaIngreso_reserva, fechaSalida_reserva 
                     FROM {$this->table_name} 
                     WHERE cabanaId_reserva = :cabanaId 
                     AND (estado_reserva = 'pendiente' OR estado_reserva = 'confirmado')
                     AND (
                         -- Caso 1: El ingreso del cliente está dentro de una reserva existente
                         (:fechaIngreso >= fechaIngreso_reserva AND :fechaIngreso < fechaSalida_reserva)
                         OR
                         -- Caso 2: La salida del cliente está dentro de una reserva existente
                         (:fechaSalida > fechaIngreso_reserva AND :fechaSalida <= fechaSalida_reserva)
                         OR
                         -- Caso 3: El cliente engloba completamente una reserva existente
                         (:fechaIngreso <= fechaIngreso_reserva AND :fechaSalida >= fechaSalida_reserva)
                     )";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':cabanaId', $cabanaId);
            $stmt->bindValue(':fechaIngreso', $fechaIngreso);
            $stmt->bindValue(':fechaSalida', $fechaSalida);
            $stmt->execute();
            
            $conflicts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (!empty($conflicts)) {
                // Hay conflictos, generar mensaje de error
                $conflictInfo = [];
                foreach ($conflicts as $conflict) {
                    $conflictInfo[] = "Reserva #{$conflict['id_reserva']} del {$conflict['fechaIngreso_reserva']} al {$conflict['fechaSalida_reserva']}";
                }
                
                $message = "La cabaña no está disponible en las fechas seleccionadas. " .
                          "Conflicto con: " . implode(', ', $conflictInfo);
                
                return [
                    'available' => false,
                    'message' => $message,
                    'conflicts' => $conflicts
                ];
            }
            
            // No hay conflictos, las fechas están disponibles
            return [
                'available' => true,
                'message' => 'Las fechas seleccionadas están disponibles para esta cabaña'
            ];
            
        } catch (Exception $e) {
            error_log("Error en validateAvailability(): " . $e->getMessage());
            return [
                'available' => false,
                'message' => 'Error al validar disponibilidad de fechas'
            ];
        }
    }
    
    /**
     * Busca si ya existe un archivo idéntico en el directorio
     * @param string $uploadDir Directorio de archivos
     * @param string $fileHash Hash MD5 del archivo
     * @param int $fileSize Tamaño del archivo
     * @return string|null Nombre del archivo existente o null si no existe
     */
    private function findExistingFile($uploadDir, $fileHash, $fileSize) {
        try {
            $files = glob($uploadDir . '*');
            
            foreach ($files as $existingFilePath) {
                if (is_file($existingFilePath)) {
                    $existingFileHash = md5_file($existingFilePath);
                    $existingFileSize = filesize($existingFilePath);
                    
                    // Comparar hash y tamaño para determinar si son idénticos
                    if ($existingFileHash === $fileHash && $existingFileSize === $fileSize) {
                        return basename($existingFilePath);
                    }
                }
            }
            
            return null;
        } catch (Exception $e) {
            error_log("Error en findExistingFile(): " . $e->getMessage());
            return null;
        }
    }
}
?>
