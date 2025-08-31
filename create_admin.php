<?php
/**
 * Script para crear un administrador con contraseña conocida
 */

// La contraseña que queremos usar
$password = 'password';

// Generar hash
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

echo "Contraseña original: " . $password . "\n";
echo "Hash generado: " . $hashedPassword . "\n";

// Verificar que el hash funciona
if (password_verify($password, $hashedPassword)) {
    echo "✅ Verificación exitosa - el hash es correcto\n";
} else {
    echo "❌ Error en la verificación del hash\n";
}

// Mostrar consulta SQL para actualizar
echo "\nConsulta SQL para actualizar:\n";
echo "UPDATE admins SET password_admin = '" . $hashedPassword . "' WHERE email_admin = 'admin@magiadelpoas.com';\n";
?>
