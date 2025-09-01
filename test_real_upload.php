<?php
/**
 * Script para simular una petición POST real con archivos
 * Esto simula exactamente lo que hace el frontend
 */

// Simular variables de entorno como si fuera una petición real
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';

// Crear archivo de prueba
$testImagePath = __DIR__ . '/test_image.jpg';
if (!file_exists($testImagePath)) {
    // Crear un archivo de prueba simple
    file_put_contents($testImagePath, 'Test image content');
    echo "Archivo de prueba creado: {$testImagePath}\n";
}

// Simular $_FILES como si fuera una petición real
$_FILES = [
    'primerDeposito' => [
        'name' => 'test_image.jpg',
        'type' => 'image/jpeg',
        'tmp_name' => $testImagePath,
        'error' => UPLOAD_ERR_OK,
        'size' => filesize($testImagePath)
    ]
];

// Simular $_POST como si fuera una petición real
$_POST = [
    'cabanaId' => '1',
    'cabanaNombre' => 'Test Cabaña',
    'cabanaColor' => '#FF0000',
    'nombreCliente' => 'Test Cliente',
    'emailCliente' => 'test@example.com',
    'nacionalidad' => 'Costa Rica',
    'mascotas' => 'No',
    'cantidadPersonas' => '2',
    'deposito' => '100%',
    'moneda' => 'Colones',
    'totalDepositado' => '50000',
    'horaIngreso' => '15:00',
    'horaSalida' => '11:00',
    'fechaIngreso' => '2025-01-15',
    'fechaSalida' => '2025-01-17',
    'tipoPagoPrimerDeposito' => 'Sinpe móvil',
    'tipoPagoSegundoDeposito' => '',
    'tipoReserva' => 'WhatsApp',
    'extras' => '[]',
    'isEdit' => 'false'
];

echo "=== SIMULANDO PETICIÓN POST CON ARCHIVOS ===\n";
echo "Archivos simulados:\n";
print_r($_FILES);
echo "\nDatos POST simulados:\n";
print_r($_POST);

// Incluir archivos necesarios
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Reserva.php';

try {
    // Crear instancia del modelo
    $reservaModel = new Reserva();
    
    echo "\n=== PROBANDO CREACIÓN DE RESERVA ===\n";
    
    // Mapear datos como lo hace el controlador
    $mappedData = [
        'cabanaId_reserva' => $_POST['cabanaId'],
        'cabanaNombre_reserva' => $_POST['cabanaNombre'],
        'cabanaColor_reserva' => $_POST['cabanaColor'],
        'nombreCliente_reserva' => $_POST['nombreCliente'],
        'emailCliente_reserva' => $_POST['emailCliente'],
        'nacionalidad_reserva' => $_POST['nacionalidad'],
        'mascotas_reserva' => $_POST['mascotas'],
        'cantidadPersonas_reserva' => $_POST['cantidadPersonas'],
        'deposito_reserva' => $_POST['deposito'],
        'moneda_reserva' => $_POST['moneda'],
        'totalDepositado_reserva' => $_POST['totalDepositado'],
        'horaIngreso_reserva' => $_POST['horaIngreso'],
        'horaSalida_reserva' => $_POST['horaSalida'],
        'fechaIngreso_reserva' => $_POST['fechaIngreso'],
        'fechaSalida_reserva' => $_POST['fechaSalida'],
        'tipoPagoPrimerDeposito_reserva' => $_POST['tipoPagoPrimerDeposito'],
        'tipoPagoSegundoDeposito_reserva' => $_POST['tipoPagoSegundoDeposito'],
        'tipoReserva_reserva' => $_POST['tipoReserva'],
        'extras_reserva' => $_POST['extras'],
        'isEdit_reserva' => $_POST['isEdit']
    ];
    
    echo "Datos mapeados:\n";
    print_r($mappedData);
    
    // Llamar a la función create directamente
    $result = $reservaModel->create($mappedData, $_FILES);
    
    echo "\n=== RESULTADO ===\n";
    print_r($result);
    
    if ($result['success']) {
        echo "\n✅ RESERVA CREADA EXITOSAMENTE\n";
        echo "ID: " . $result['data']['id_reserva'] . "\n";
        
        // Verificar que el archivo se guardó
        $uploadDir = __DIR__ . '/imgComprobantes/';
        $files = scandir($uploadDir);
        echo "\nArchivos en el directorio de uploads:\n";
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $filePath = $uploadDir . $file;
                echo "- {$file} (" . filesize($filePath) . " bytes)\n";
            }
        }
    } else {
        echo "\n❌ ERROR AL CREAR RESERVA\n";
        echo "Mensaje: " . $result['message'] . "\n";
    }
    
} catch (Exception $e) {
    echo "\n❌ EXCEPCIÓN: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}

// Limpiar archivo de prueba
if (file_exists($testImagePath)) {
    unlink($testImagePath);
    echo "\nArchivo de prueba eliminado.\n";
}
?>
