<?php
/**
 * Debug específico para el problema de login
 * Este archivo nos ayudará a identificar exactamente dónde está el error
 */

// Configurar manejo de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivos necesarios
require_once __DIR__ . '/config/Config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Admin.php';
require_once __DIR__ . '/utils/JWT.php';

// Inicializar configuración
Config::init();

echo "<h1>🔍 Debug Login - API Magia del Poas</h1>";

try {
    echo "<h2>1. Verificando conexión a base de datos...</h2>";
    $db = Database::getInstance()->getConnection();
    echo "✅ Conexión a base de datos exitosa<br>";
    
    echo "<h2>2. Verificando configuración...</h2>";
    echo "JWT_SECRET_KEY: " . (Config::JWT_SECRET_KEY ? "✅ Configurado" : "❌ No configurado") . "<br>";
    echo "JWT_ALGORITHM: " . Config::JWT_ALGORITHM . "<br>";
    echo "JWT_EXPIRATION_TIME: " . Config::JWT_EXPIRATION_TIME . "<br>";
    
    echo "<h2>3. Verificando tabla admins...</h2>";
    $stmt = $db->query("SHOW TABLES LIKE 'admins'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Tabla 'admins' existe<br>";
        
        // Verificar estructura de la tabla
        $stmt = $db->query("DESCRIBE admins");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Columnas de la tabla admins:<br>";
        echo "<ul>";
        foreach ($columns as $column) {
            echo "<li>{$column['Field']} - {$column['Type']}</li>";
        }
        echo "</ul>";
        
        // Verificar si hay administradores
        $stmt = $db->query("SELECT COUNT(*) as total FROM admins");
        $total = $stmt->fetch()['total'];
        echo "Total de administradores: {$total}<br>";
        
    } else {
        echo "❌ Tabla 'admins' no existe<br>";
    }
    
    echo "<h2>4. Probando creación de instancia Admin...</h2>";
    $adminModel = new Admin();
    echo "✅ Instancia Admin creada exitosamente<br>";
    
    echo "<h2>5. Probando método authenticate...</h2>";
    
    // Datos de prueba
    $testEmail = "admin@magiadelpoas.com";
    $testPassword = "tu_contraseña";
    
    echo "Email de prueba: {$testEmail}<br>";
    echo "Password de prueba: {$testPassword}<br>";
    
    // Verificar si el usuario existe
    $stmt = $db->prepare("SELECT id_admin, name_admin, email_admin, status_admin FROM admins WHERE email_admin = ?");
    $stmt->execute([$testEmail]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo "✅ Usuario encontrado en la base de datos<br>";
        echo "ID: {$user['id_admin']}<br>";
        echo "Nombre: {$user['name_admin']}<br>";
        echo "Status: {$user['status_admin']}<br>";
        
        // Intentar autenticación
        echo "<h3>Intentando autenticación...</h3>";
        $result = $adminModel->authenticate($testEmail, $testPassword);
        
        echo "Resultado de autenticación:<br>";
        echo "<pre>" . json_encode($result, JSON_PRETTY_PRINT) . "</pre>";
        
    } else {
        echo "❌ Usuario no encontrado en la base de datos<br>";
        echo "Creando usuario de prueba...<br>";
        
        // Crear usuario de prueba
        $hashedPassword = password_hash($testPassword, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO admins (name_admin, email_admin, password_admin, status_admin) VALUES (?, ?, ?, ?)");
        $stmt->execute(['Admin Test', $testEmail, $hashedPassword, Config::ADMIN_STATUS_ACTIVE]);
        
        echo "✅ Usuario de prueba creado<br>";
        
        // Intentar autenticación nuevamente
        echo "<h3>Intentando autenticación con usuario creado...</h3>";
        $result = $adminModel->authenticate($testEmail, $testPassword);
        
        echo "Resultado de autenticación:<br>";
        echo "<pre>" . json_encode($result, JSON_PRETTY_PRINT) . "</pre>";
    }
    
    echo "<h2>6. Probando generación de JWT...</h2>";
    $testPayload = [
        'data' => [
            'id' => 1,
            'email' => 'test@example.com',
            'name' => 'Test User'
        ]
    ];
    
    $token = JWT::encode($testPayload);
    echo "✅ Token JWT generado: " . substr($token, 0, 50) . "...<br>";
    
    $decoded = JWT::decode($token);
    echo "✅ Token JWT decodificado correctamente<br>";
    
} catch (Exception $e) {
    echo "<h2>❌ Error encontrado:</h2>";
    echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;'>";
    echo "<strong>Mensaje:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>Archivo:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Línea:</strong> " . $e->getLine() . "<br>";
    echo "<strong>Trace:</strong><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
} catch (Error $e) {
    echo "<h2>❌ Error fatal encontrado:</h2>";
    echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;'>";
    echo "<strong>Mensaje:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>Archivo:</strong> " . $e->getFile() . "<br>";
    echo "<strong>Línea:</strong> " . $e->getLine() . "<br>";
    echo "<strong>Trace:</strong><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}

echo "<h2>7. Información del sistema:</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "PDO Drivers: " . implode(', ', PDO::getAvailableDrivers()) . "<br>";
echo "Memory Limit: " . ini_get('memory_limit') . "<br>";
echo "Max Execution Time: " . ini_get('max_execution_time') . "<br>";
?>

