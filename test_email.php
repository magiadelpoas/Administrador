<?php
/**
 * Script de prueba para verificar el funcionamiento del sistema de email mejorado
 * 
 * Este script simula el envío de un email de confirmación de reserva
 * para verificar que las mejoras implementadas funcionen correctamente.
 * 
 * Uso: php test_email.php
 */

require_once __DIR__ . '/services/EmailService.php';

// Datos de prueba para simular una reserva
$reservaDataTest = [
    'id_reserva' => 999999,
    'nombreCliente_reserva' => 'Usuario de Prueba',
    'emailCliente_reserva' => 'test@example.com', // Cambiar por un email real para pruebas
    'telefono_reserva' => '+506 8888-8888',
    'cabanaNombre_reserva' => 'Cabaña de Prueba',
    'deposito_reserva' => '$100.00',
    'horaIngreso_reserva' => '15:00',
    'horaSalida_reserva' => '11:00',
    'fechaIngreso_reserva' => '2024-12-15',
    'fechaSalida_reserva' => '2024-12-17',
    'cantidadPersonas_reserva' => '2',
    'mascotas_reserva' => 'No'
];

echo "=== PRUEBA DEL SISTEMA DE EMAIL MEJORADO ===\n";
echo "Fecha: " . date('Y-m-d H:i:s') . "\n";
echo "Reserva de prueba ID: " . $reservaDataTest['id_reserva'] . "\n";
echo "Email destinatario: " . $reservaDataTest['emailCliente_reserva'] . "\n";
echo "\n";

echo "Iniciando prueba de envío de email...\n";

try {
    $resultado = EmailService::sendReservationConfirmation($reservaDataTest);
    
    if ($resultado) {
        echo "✅ ÉXITO: Email enviado correctamente\n";
        echo "El sistema de email mejorado está funcionando.\n";
    } else {
        echo "❌ FALLO: No se pudo enviar el email\n";
        echo "Revise los logs para más detalles.\n";
    }
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Revise la configuración del sistema.\n";
}

echo "\n=== FIN DE LA PRUEBA ===\n";
echo "\nNotas importantes:\n";
echo "1. Cambie el email de prueba por uno real antes de ejecutar\n";
echo "2. Revise los logs del servidor para detalles adicionales\n";
echo "3. Si falla, el sistema intentará múltiples configuraciones automáticamente\n";
echo "4. Los fallos se registran en ApiMagia/logs/email_failures.log\n";

?>
