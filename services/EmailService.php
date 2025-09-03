<?php
/**
 * Servicio de Email - Maneja el envío de correos electrónicos
 * Utiliza PHPMailer para el envío de emails con plantillas HTML
 * 
 * @author Magia del Poas Development Team
 * @version 1.0
 */

require_once __DIR__ . '/../controllers/PHPMailer/src/Exception.php';
require_once __DIR__ . '/../controllers/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../controllers/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    
    /**
     * Genera un nombre de remitente variado para evitar bloqueos
     * @return string Nombre del remitente con variación
     */
    private static function generateSenderName() {
        $variations = [
            'Magia del Poas - Cabañas de Montaña',
            'Magia del Poas - Cabañas',
            'Magia del Poas - Reservas',
            'Magia del Poas - Turismo Rural',
            'Magia del Poas - Cabañas Ecológicas',
            'Magia del Poas - Alojamiento',
            'Magia del Poas - Hospedaje',
            'Magia del Poas - Ecoturismo'
        ];
        
        return $variations[array_rand($variations)];
    }
    
    /**
     * Genera un ID único para cada email
     * @param int $reservaId ID de la reserva
     * @return string ID único del email
     */
    private static function generateUniqueEmailId($reservaId) {
        return uniqid('mdp_' . $reservaId . '_', true) . '_' . time();
    }
    
    /**
     * Añade un pequeño delay aleatorio para evitar detección de envío masivo
     */
    private static function addRandomDelay() {
        // Delay aleatorio entre 1 y 3 segundos
        $delay = rand(1, 3);
        sleep($delay);
    }
    
    /**
     * Registra el éxito del envío de email para estadísticas
     * @param int $reservaId ID de la reserva
     * @param string $email Email del destinatario
     * @param string $senderName Nombre del remitente usado
     * @param string $uniqueId ID único del email
     * @param string $method Método usado (primary/fallback)
     */
    private static function logEmailSuccess($reservaId, $email, $senderName, $uniqueId, $method) {
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'reserva_id' => $reservaId,
            'email' => $email,
            'sender_name' => $senderName,
            'unique_id' => $uniqueId,
            'method' => $method,
            'status' => 'success'
        ];
        
        error_log("EMAIL_STATS: " . json_encode($logData));
        
        // Opcional: Guardar en base de datos para análisis posterior
        // self::saveEmailLog($logData);
    }
    
    /**
     * Envía un email de confirmación de reserva
     * @param array $reservaData Datos completos de la reserva
     * @return bool True si el email se envió exitosamente, false en caso contrario
     */
    public static function sendReservationConfirmation($reservaData) {
        try {
            // Extraer datos necesarios
            $name = $reservaData['nombreCliente_reserva'];
            $email = $reservaData['emailCliente_reserva'];
            $phone = $reservaData['telefono_reserva'] ?? '00';
            $cabanaName = $reservaData['cabanaNombre_reserva'];
            $deposito = $reservaData['deposito_reserva'];
            $horaIngreso = $reservaData['horaIngreso_reserva'];
            $horaSalida = $reservaData['horaSalida_reserva'];
            $fechaIngreso = $reservaData['fechaIngreso_reserva'];
            $fechaSalida = $reservaData['fechaSalida_reserva'];
            $cantidadPersonas = $reservaData['cantidadPersonas_reserva'];
            $mascotas = $reservaData['mascotas_reserva'];
            $reservaId = $reservaData['id_reserva'];
            
            // Crear el mensaje HTML con los datos de la reserva
            $message = self::createReservationMessage($reservaData);
            
            return self::sendEmail($name, $email, $message, $reservaId);
            
        } catch (Exception $e) {
            error_log("Error en sendReservationConfirmation(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Crea el mensaje HTML con los datos de la reserva
     * @param array $reservaData Datos de la reserva
     * @return string Mensaje HTML formateado
     */
    private static function createReservationMessage($reservaData) {
        // Usar mb_convert_encoding para corregir problemas de codificación
        $name = mb_convert_encoding($reservaData['nombreCliente_reserva'], 'UTF-8', 'auto');
        $email = mb_convert_encoding($reservaData['emailCliente_reserva'], 'UTF-8', 'auto');
        $phone = mb_convert_encoding($reservaData['telefono_reserva'] ?? '00', 'UTF-8', 'auto');
        $cabanaName = mb_convert_encoding($reservaData['cabanaNombre_reserva'], 'UTF-8', 'auto');
        $deposito = mb_convert_encoding($reservaData['deposito_reserva'], 'UTF-8', 'auto');
        $horaIngreso = mb_convert_encoding($reservaData['horaIngreso_reserva'], 'UTF-8', 'auto');
        $horaSalida = mb_convert_encoding($reservaData['horaSalida_reserva'], 'UTF-8', 'auto');
        $fechaIngreso = mb_convert_encoding($reservaData['fechaIngreso_reserva'], 'UTF-8', 'auto');
        $fechaSalida = mb_convert_encoding($reservaData['fechaSalida_reserva'], 'UTF-8', 'auto');
        $cantidadPersonas = mb_convert_encoding($reservaData['cantidadPersonas_reserva'], 'UTF-8', 'auto');
        $mascotas = mb_convert_encoding($reservaData['mascotas_reserva'], 'UTF-8', 'auto');
        $reservaId = $reservaData['id_reserva'];
        
        // Crear tabla HTML con estilos mejorados
        return "
        <table style='width: 100%; max-width: 600px; margin: 20px auto; border-collapse: collapse; font-family: Arial, sans-serif; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>
            <thead>
                <tr style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;'>
                    <th colspan='2' style='padding: 20px; text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 1px;'>
                        DETALLES DE SU RESERVA
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr style='background-color: #f8f9fa;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057; width: 40%;'>
                        # Reserva:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($reservaId) . "
                    </td>
                </tr>
                <tr style='background-color: #ffffff;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Cabaña:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($cabanaName) . "
                    </td>
                </tr>
                <tr style='background-color: #f8f9fa;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Nombre:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($name) . "
                    </td>
                </tr>
                <tr style='background-color: #ffffff;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Correo:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($email) . "
                    </td>
                </tr>
                <tr style='background-color: #f8f9fa;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Teléfono:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($phone) . "
                    </td>
                </tr>
                <tr style='background-color: #ffffff;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Depósito:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($deposito) . "
                    </td>
                </tr>
                <tr style='background-color: #f8f9fa;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Hora de Ingreso:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($horaIngreso) . "
                    </td>
                </tr>
                <tr style='background-color: #ffffff;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Hora de Salida:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($horaSalida) . "
                    </td>
                </tr>
                <tr style='background-color: #f8f9fa;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Check In:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($fechaIngreso) . "
                    </td>
                </tr>
                <tr style='background-color: #ffffff;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Check Out:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($fechaSalida) . "
                    </td>
                </tr>
                <tr style='background-color: #f8f9fa;'>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;'>
                        Cantidad de Personas:
                    </td>
                    <td style='padding: 12px 20px; border-bottom: 1px solid #e9ecef; color: #6c757d;'>
                        " . htmlspecialchars($cantidadPersonas) . "
                    </td>
                </tr>
                <tr style='background-color: #ffffff;'>
                    <td style='padding: 12px 20px; font-weight: bold; color: #495057;'>
                        Mascotas:
                    </td>
                    <td style='padding: 12px 20px; color: #6c757d;'>
                        " . htmlspecialchars($mascotas) . "
                    </td>
                </tr>
            </tbody>
        </table>";
    }
    
    /**
     * Envía un email usando PHPMailer
     * @param string $name Nombre del cliente
     * @param string $email Email del cliente
     * @param string $message Mensaje HTML con los datos de la reserva
     * @param int $reservaId ID de la reserva
     * @return bool True si el email se envió exitosamente, false en caso contrario
     */
    private static function sendEmail($name, $email, $message, $reservaId) {
        // Validar email antes de proceder
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            error_log("Email inválido: " . $email);
            return false;
        }
        
        // Limpiar y validar el nombre
        $name = trim($name);
        if (empty($name)) {
            $name = "Cliente";
        }
        
        // Instantiation and passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            // Configuración SMTP mejorada
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            $mail->SMTPDebug = 0; // Desactivar debug en producción
            
            $mail->isSMTP(); // Send using SMTP
            $mail->Host = 'smtp.hostinger.com'; // Set the SMTP server to send through
            $mail->SMTPAuth = true; // Enable SMTP authentication
            $mail->Username = 'info@magiadelpoas.com'; // Sender's email address
            $mail->Password = 'Npls1234!'; // SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->Timeout = 60; // Aumentar timeout

            // Generar nombre de remitente variado y ID único
            $senderName = self::generateSenderName();
            $uniqueEmailId = self::generateUniqueEmailId($reservaId);
            
            // Configuración mejorada del remitente para evitar bloqueos
            $mail->setFrom('info@magiadelpoas.com', $senderName);
            $mail->addReplyTo('info@magiadelpoas.com', $senderName);
            
            // Configurar Message-ID único usando el método correcto de PHPMailer
            $mail->MessageID = '<' . $uniqueEmailId . '@magiadelpoas.com>';
            
            // Agregar headers adicionales para mejorar deliverability y evitar spam
            $mail->addCustomHeader('X-Mailer', 'MDP-RS-' . $uniqueEmailId);
            $mail->addCustomHeader('X-Priority', '3');
            $mail->addCustomHeader('X-Email-ID', $uniqueEmailId);
            $mail->addCustomHeader('List-Unsubscribe', '<mailto:info@magiadelpoas.com?subject=Unsubscribe>');
            $mail->addCustomHeader('X-Auto-Response-Suppress', 'All');
            $mail->addCustomHeader('X-Entity-ID', 'mdp-reservation-' . date('Ymd-His') . '-' . $reservaId);
            $mail->addCustomHeader('X-Campaign-ID', 'reservation-confirmation-' . date('Y-m'));
            // Agregar headers RFC-compliant para mejorar reputación
            $mail->addCustomHeader('Auto-Submitted', 'auto-generated');
            $mail->addCustomHeader('X-Spam-Status', 'No');
            
            $mail->addAddress(trim($email), $name);
            //$mail->addCC('magiadelpoas@gmail.com', 'MAGIA DEL POAS');
            
            // Content
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8'; // Asegurar codificación UTF-8
            
            // Generar subject variado
            $subjectVariations = [
                "Confirmación de Reserva - " . $senderName . " - " . $name,
                "Su Reserva ha sido Confirmada - " . $senderName . " - " . $name,
                "Reserva Confirmada - " . $senderName . " - " . $name,
                "Detalles de su Reserva - " . $senderName . " - " . $name
            ];
            $mail->Subject = $subjectVariations[array_rand($subjectVariations)] . " [ID: " . substr($uniqueEmailId, -8) . "]";

            // El mensaje ya viene formateado como tabla HTML
            $messageFormatted = $message;

            $template = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de Reserva - Magia del Poas - Cabañas de Montaña</title>
            </head>
            <body style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                      <img width="150px" height="auto" src="https://sistema.magiadelpoas.com/assets/logo.jpg" alt="Magia del Poas Logo" style="max-width: 100%; height: auto; border-radius: 8px;">
                      <h1 style="color: white; margin: 15px 0 5px 0; font-size: 24px;">Magia del Poas - Cabañas de Montaña</h1>
 
                  
                  <div style="padding: 30px;">
                      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                          <h2 style="color: #495057; text-align: center; margin-bottom: 10px; font-size: 20px;">Estimado(a) {name}</h2>
                          <p style="color: #6c757d; text-align: center; font-size: 16px; margin: 0;">{confirmation_message}</p>
                      </div>
                      
                      {message}
                  
                      <div style="margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 8px;">
                          <p style="font-size:13px;margin-bottom:15px;color:#495057;text-align:center;font-weight:bold;">
                              Si necesita modificar su reserva, contáctenos por 
                              <a href="https://wa.me/50687234000?text=Hola,%20necesito%20ayuda%20con%20mi%20reserva%20numero:%20' . $reservaId . '" style="color: #25d366; text-decoration: none; font-weight: bold;">WhatsApp</a>
                          </p>
                          
                          <div style="margin-top: 20px; padding: 15px; background-color: #fff; border-radius: 8px; border: 1px solid #dee2e6;">
                              <h3 style="font-size:14px;margin-bottom:15px;color:#495057;text-align:center;font-weight:bold;">Política de Cancelación</h3>
                              <ul style="margin: 0; padding-left: 20px;">
                                  <li style="font-size:12px;margin-bottom:8px;color:#6c757d;line-height:1.5;">
                                      Las cancelaciones deben enviarse por correo a <strong>info@magiadelpoas.com</strong> y Ser confirmada por la administración.
                                  </li>
                                  <li style="font-size:12px;margin-bottom:8px;color:#6c757d;line-height:1.5;">
                                      <strong>7+ días antes:</strong> Sin penalización.
                                  </li>
                                  <li style="font-size:12px;margin-bottom:8px;color:#6c757d;line-height:1.5;">
                                      <strong>3-6 días antes:</strong> Penalización del 50%.
                                  </li>
                                  <li style="font-size:12px;margin-bottom:8px;color:#6c757d;line-height:1.5;">
                                      <strong>0-2 días antes:</strong> Penalización del 100%.
                                  </li>
                                  <li style="font-size:12px;margin-bottom:0;color:#6c757d;line-height:1.5;">
                                      <strong>Crédito transferible:</strong> Válido por 3 meses para cancelaciones con 7+ días de anticipación.
                                  </li>
                              </ul>
                          </div>
                          
                          <p style="font-size:16px;margin:25px 0 15px 0;color:#495057;text-align:center;font-weight:bold;">¡Será un placer recibirles!</p>
                          
                          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                              <p style="font-size:12px;margin-bottom:10px;color:#6c757d;">Cómo llegar:</p>
                              <a href="https://goo.gl/maps/YXgyPfKbJWHpSXgP6" style="display: inline-block; margin: 0 10px; text-decoration: none; padding: 8px 12px; background-color: #4285f4; color: white; border-radius: 5px; font-size: 12px;">
                                  📍 Google Maps
                              </a>
                              <a href="https://www.waze.com/en/live-map/directions/cr/provincia-de-alajuela/magia-del-poas?navigate=yes&place=ChIJxSzYulX1oI8R1fz2JmE088s" style="display: inline-block; margin: 0 10px; text-decoration: none; padding: 8px 12px; background-color: #00d4aa; color: white; border-radius: 5px; font-size: 12px;">
                                  🚗 Waze
                              </a>
                          </div>
                          
                          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                              <p style="font-size:11px;color:#6c757d;margin:0;">
                                  Magia del Poas - Cabañas de Montaña<br>
                                  📧 info@magiadelpoas.com | 📱 WhatsApp: +506 8723-4000
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
            </body>
            </html>';

            // Generar mensaje de confirmación variado
            $confirmationMessages = [
                'Su reserva ha sido confirmada'
            ];
            $confirmationMessage = $confirmationMessages[array_rand($confirmationMessages)];
            
            $search = ['{name}', '{message}', '{confirmation_message}'];
            $replace = [$name, $messageFormatted, $confirmationMessage];
            $mensaje = str_replace($search, $replace, $template);
            $mail->Body = $mensaje;
            
            // Añadir delay aleatorio para evitar detección de spam
            self::addRandomDelay();
            
            $mail->send();
            
            error_log("Email de confirmación enviado exitosamente a: " . $email . " | Sender: " . $senderName . " | ID: " . $uniqueEmailId);
            self::logEmailSuccess($reservaId, $email, $senderName, $uniqueEmailId, 'primary');
            return true;
            
        } catch (Exception $e) {
            error_log("Error al enviar email de confirmación: " . $e->getMessage());
            error_log("Email destinatario: " . $email);
            error_log("Nombre cliente: " . $name);
            
            // Si falla el envío, intentar con configuración alternativa
            return self::sendEmailFallback($name, $email, $message, $reservaId, $e->getMessage());
        }
    }
    
    /**
     * Método de fallback para envío de emails cuando falla el método principal
     * @param string $name Nombre del cliente
     * @param string $email Email del cliente  
     * @param string $message Mensaje HTML
     * @param int $reservaId ID de la reserva
     * @param string $originalError Error original
     * @return bool
     */
    private static function sendEmailFallback($name, $email, $message, $reservaId, $originalError) {
        try {
            $mail = new PHPMailer(true);
            
            // Configuración más permisiva para evitar bloqueos
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            $mail->isSMTP();
            $mail->Host = 'smtp.hostinger.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'info@magiadelpoas.com';
            $mail->Password = 'Npls1234!';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->Timeout = 30;
            
            // Generar nombre de remitente variado y ID único para fallback
            $senderName = self::generateSenderName();
            $uniqueEmailId = self::generateUniqueEmailId($reservaId);
            
            // Configuración más simple del remitente
            $mail->setFrom('info@magiadelpoas.com', $senderName);
            $mail->addAddress(trim($email));
            
            // Configurar Message-ID único para fallback usando el método correcto
            $mail->MessageID = '<fb_' . $uniqueEmailId . '@magiadelpoas.com>';
            
            // Agregar headers únicos para fallback
            $mail->addCustomHeader('X-Mailer', 'MDP-FB-' . $uniqueEmailId);
            $mail->addCustomHeader('X-Email-ID', $uniqueEmailId);
            
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
            $mail->Subject = "Confirmación Reserva #" . $reservaId . " - " . $senderName . " [FB: " . substr($uniqueEmailId, -6) . "]";
            
            // Mensaje más simple para evitar filtros de spam
            $simpleMessage = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333; text-align: center;'>Confirmación de Reserva</h2>
                <p>Estimado(a) <strong>" . htmlspecialchars($name) . "</strong>,</p>
                <p>Su reserva ha sido confirmada.</p>
                " . $message . "
                <hr style='margin: 30px 0;'>
                <p style='font-size: 12px; color: #666; text-align: center;'>
                    Magia del Poas - Cabañas de Montaña<br>        
                    Email: info@magiadelpoas.com | WhatsApp: +506 8723-4000
                </p>
            </div>";
            
            $mail->Body = $simpleMessage;
            
            // Añadir delay aleatorio para fallback
            self::addRandomDelay();
            
            $mail->send();
            
            error_log("Email enviado exitosamente usando método fallback a: " . $email . " | Sender: " . $senderName . " | ID: " . $uniqueEmailId);
            self::logEmailSuccess($reservaId, $email, $senderName, $uniqueEmailId, 'fallback');
            return true;
            
        } catch (Exception $e) {
            error_log("Error en método fallback: " . $e->getMessage());
            error_log("Error original: " . $originalError);
            
            // Como último recurso, enviar notificación al administrador
            self::notifyAdminEmailFailure($name, $email, $reservaId, $originalError, $e->getMessage());
            return false;
        }
    }
    
    /**
     * Notifica al administrador sobre fallos en el envío de emails
     * @param string $name Nombre del cliente
     * @param string $email Email del cliente
     * @param int $reservaId ID de la reserva
     * @param string $originalError Error original
     * @param string $fallbackError Error del fallback
     */
    private static function notifyAdminEmailFailure($name, $email, $reservaId, $originalError, $fallbackError) {
        error_log("ALERTA: No se pudo enviar email de confirmación de reserva");
        error_log("Reserva ID: " . $reservaId);
        error_log("Cliente: " . $name . " (" . $email . ")");
        error_log("Error principal: " . $originalError);
        error_log("Error fallback: " . $fallbackError);
        
        // Aquí podrías implementar envío de notificación por WhatsApp, Telegram, etc.
        // O guardar en una tabla de emails fallidos para reenvío manual
    }
}
?>
