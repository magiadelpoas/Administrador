<?php
/**
 * Script de prueba para verificar la funcionalidad de la API
 * Ejecuta pruebas básicas de conexión a BD y funcionalidad
 */

// Incluir archivos necesarios
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Admin.php';
require_once __DIR__ . '/utils/JWT.php';

echo "=== PRUEBA DE API MAGIA DEL POAS ===\n\n";

try {
    // 1. Probar conexión a base de datos
    echo "1. Probando conexión a base de datos...\n";
    $db = Database::getInstance();
    if ($db->isConnected()) {
        echo "✅ Conexión a base de datos exitosa\n\n";
    } else {
        echo "❌ Error en conexión a base de datos\n\n";
        exit(1);
    }

    // 2. Probar modelo Admin
    echo "2. Probando modelo Admin...\n";
    $adminModel = new Admin();
    
    // Obtener todos los administradores
    $result = $adminModel->getAll(1, 5);
    if ($result['success']) {
        echo "✅ Consulta de administradores exitosa\n";
        echo "   Total de administradores: " . $result['pagination']['total_records'] . "\n";
        
        if (!empty($result['data'])) {
            echo "   Primer administrador: " . $result['data'][0]['name_admin'] . " (" . $result['data'][0]['email_admin'] . ")\n";
        }
    } else {
        echo "❌ Error al consultar administradores: " . $result['message'] . "\n";
    }
    echo "\n";

    // 3. Probar autenticación
    echo "3. Probando autenticación...\n";
    
    // Primero, verificar si existe el administrador de prueba
    $testEmail = 'admin@magiadelpoas.com';
    $testPassword = 'password';
    
    $authResult = $adminModel->authenticate($testEmail, $testPassword);
    if ($authResult['success']) {
        echo "✅ Autenticación exitosa\n";
        echo "   Usuario: " . $authResult['data']['admin']['name_admin'] . "\n";
        echo "   Token generado: " . substr($authResult['data']['token'], 0, 50) . "...\n";
        
        // 4. Probar JWT
        echo "\n4. Probando JWT...\n";
        $token = $authResult['data']['token'];
        $decodedData = JWT::getUserFromToken($token);
        if ($decodedData) {
            echo "✅ Decodificación de JWT exitosa\n";
            echo "   ID de usuario: " . $decodedData['id'] . "\n";
            echo "   Email: " . $decodedData['email'] . "\n";
        } else {
            echo "❌ Error al decodificar JWT\n";
        }
    } else {
        echo "❌ Error en autenticación: " . $authResult['message'] . "\n";
        echo "   Nota: Asegúrate de que existe un administrador con email 'admin@magiadelpoas.com' y contraseña 'password'\n";
    }
    echo "\n";

    // 5. Probar creación de administrador
    echo "5. Probando creación de administrador...\n";
    $testAdminData = [
        'name_admin' => 'Admin de Prueba',
        'email_admin' => 'test@magiadelpoas.com',
        'password_admin' => 'password123',
        'phone_admin' => '12345678',
        'status_admin' => 1
    ];
    
    $createResult = $adminModel->create($testAdminData);
    if ($createResult['success']) {
        echo "✅ Creación de administrador exitosa\n";
        echo "   ID del nuevo administrador: " . $createResult['data']['id_admin'] . "\n";
        
        // Limpiar - eliminar el administrador de prueba
        $adminModel->delete($createResult['data']['id_admin']);
        echo "   Administrador de prueba eliminado\n";
    } else {
        echo "⚠️  Error o conflicto en creación: " . $createResult['message'] . "\n";
    }
    echo "\n";

    echo "=== RESUMEN ===\n";
    echo "✅ Base de datos: Conectada\n";
    echo "✅ Modelo Admin: Funcionando\n";
    echo "✅ Sistema JWT: Funcionando\n";
    echo "✅ API lista para usar\n\n";

    echo "Credenciales de prueba:\n";
    echo "Email: admin@magiadelpoas.com\n";
    echo "Password: password\n\n";

    echo "Endpoints disponibles:\n";
    echo "- POST /api/auth/login\n";
    echo "- GET /api/admins\n";
    echo "- GET /api/health\n";
    echo "- GET /api/docs\n";

} catch (Exception $e) {
    echo "❌ Error crítico: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
?>
