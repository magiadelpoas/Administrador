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
     * Envía un email usando PHPMailer con múltiples configuraciones de fallback
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
        
        // Configuraciones SMTP múltiples para evitar bloqueos
        $smtpConfigs = [
            // Configuración 1: Hostinger directo sin MailChannels
            [
                'host' => 'smtp.hostinger.com',
                'port' => 465,
                'secure' => PHPMailer::ENCRYPTION_SMTPS,
                'username' => 'info@magiadelpoas.com',
                'password' => 'Npls1234!',
                'from_email' => 'info@magiadelpoas.com',
                'from_name' => 'Magia del Poas - Cabañas de montaña',
                'timeout' => 30
            ],
            // Configuración 2: Hostinger alternativa con STARTTLS
            [
                'host' => 'smtp.hostinger.com', 
                'port' => 587,
                'secure' => PHPMailer::ENCRYPTION_STARTTLS,
                'username' => 'info@magiadelpoas.com',
                'password' => 'Npls1234!',
                'from_email' => 'info@magiadelpoas.com',
                'from_name' => 'Magia del Poas. Cabañas de montaña',
                'timeout' => 45
            ],
            // Configuración 3: Hostinger con puerto alternativo
            [
                'host' => 'smtp.hostinger.com',
                'port' => 2525,
                'secure' => PHPMailer::ENCRYPTION_STARTTLS,
                'username' => 'info@magiadelpoas.com',
                'password' => 'Npls1234!',
                'from_email' => 'info@magiadelpoas.com',
                'from_name' => 'Magia del Poas Cabañas de montaña',
                'timeout' => 60
            ]
        ];
        
        // Intentar enviar con cada configuración
        foreach ($smtpConfigs as $index => $config) {
            $mail = new PHPMailer(true);
            
            try {
                // Configuración SMTP más robusta
                $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true,
                        'disable_compression' => true,
                    )
                );
                $mail->SMTPDebug = 0; // Desactivar debug en producción
                
                $mail->isSMTP();
                $mail->Host = $config['host'];
                $mail->SMTPAuth = true;
                $mail->Username = $config['username'];
                $mail->Password = $config['password'];
                $mail->SMTPSecure = $config['secure'];
                $mail->Port = $config['port'];
                $mail->Timeout = $config['timeout'];
                $mail->SMTPKeepAlive = true; // Mantener conexión activa

                // Configuración del remitente
                $mail->setFrom($config['from_email'], $config['from_name']);
                $mail->addReplyTo($config['from_email'], $config['from_name']);
                
                // Headers mejorados para evitar filtros de spam
                $mail->addCustomHeader('X-Mailer', 'Magia del Poas System v2.0');
                $mail->addCustomHeader('X-Priority', '3');
                $mail->addCustomHeader('X-MSMail-Priority', 'Normal');
                $mail->addCustomHeader('Importance', 'Normal');
                $mail->addCustomHeader('List-Unsubscribe', '<mailto:info@magiadelpoas.com?subject=Unsubscribe>');
                $mail->addCustomHeader('X-Auto-Response-Suppress', 'OOF, DR, RN, NRN, AutoReply');
                
                $mail->addAddress(trim($email), $name);
                
                // Content
                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                $mail->Encoding = 'base64'; // Mejor codificación para caracteres especiales
                $mail->Subject = "Confirmación de Reserva #" . $reservaId . " - Magia del Poas";

                // El mensaje ya viene formateado como tabla HTML
                $messageFormatted = $message;

                $template = '
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de Reserva - Magia del Poas</title>
            </head>
            <body style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                      <img width="150px" height="auto" src="https://sistema.magiadelpoas.com/assets/logo.jpg" alt="Magia del Poas Logo" style="max-width: 100%; height: auto; border-radius: 8px;">
                      <h1 style="color: white; margin: 15px 0 5px 0; font-size: 24px;">Magia del Poas</h1>
                      <p style="color: #f0f0f0; margin: 0; font-size: 14px;">Cabañas de Montaña</p>
                  </div>
                  
                  <div style="padding: 30px;">
                      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                          <h2 style="color: #495057; text-align: center; margin-bottom: 10px; font-size: 20px;">Estimado(a) {name}</h2>
                          <p style="color: #6c757d; text-align: center; font-size: 16px; margin: 0;">Su reserva ha sido confirmada exitosamente</p>
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
                                      Las cancelaciones deben enviarse por correo a <strong>info@magiadelpoas.com</strong> y Ser confirmadas por la administración..
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
                          
                          <p style="font-size:16px;margin:25px 0 15px 0;color:#495057;text-align:center;font-weight:bold;">¡Esperamos recibirle pronto!</p>
                          
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

                $search = ['{name}', '{message}'];
                $replace = [$name, $messageFormatted];
                $mensaje = str_replace($search, $replace, $template);
                $mail->Body = $mensaje;
                
                $mail->send();
                
                error_log("Email de confirmación enviado exitosamente a: " . $email . " usando configuración " . ($index + 1));
                return true;
                
            } catch (Exception $e) {
                error_log("Error con configuración SMTP " . ($index + 1) . ": " . $e->getMessage());
                
                // Si es el último intento, usar el método de fallback
                if ($index === count($smtpConfigs) - 1) {
                    error_log("Todas las configuraciones SMTP fallaron para: " . $email);
                    return self::sendEmailFallback($name, $email, $message, $reservaId, $e->getMessage());
                }
                
                // Continuar con la siguiente configuración
                continue;
            }
        }
        
        // Si llegamos aquí, todas las configuraciones fallaron
        error_log("Error crítico: No se pudo enviar email con ninguna configuración SMTP");
        return false;
    }
    
    /**
     * Método de fallback mejorado con múltiples estrategias para envío de emails
     * @param string $name Nombre del cliente
     * @param string $email Email del cliente  
     * @param string $message Mensaje HTML
     * @param int $reservaId ID de la reserva
     * @param string $originalError Error original
     * @return bool
     */
    private static function sendEmailFallback($name, $email, $message, $reservaId, $originalError) {
        // Configuraciones de fallback adicionales
        $fallbackConfigs = [
            // Configuración 1: Sin SSL/TLS
            [
                'host' => 'smtp.hostinger.com',
                'port' => 25,
                'secure' => false,
                'auth' => true,
                'username' => 'info@magiadelpoas.com',
                'password' => 'Npls1234!',
                'timeout' => 30
            ],
            // Configuración 2: Solo SSL básico
            [
                'host' => 'smtp.hostinger.com',
                'port' => 465,
                'secure' => 'ssl',
                'auth' => true,
                'username' => 'info@magiadelpoas.com',
                'password' => 'Npls1234!',
                'timeout' => 45
            ],
            // Configuración 3: PHP mail() function como último recurso
            [
                'use_php_mail' => true
            ]
        ];
        
        foreach ($fallbackConfigs as $index => $config) {
            try {
                if (isset($config['use_php_mail']) && $config['use_php_mail']) {
                    // Usar función mail() de PHP como último recurso
                    return self::sendEmailWithPHPMail($name, $email, $message, $reservaId);
                }
                
                $mail = new PHPMailer(true);
                
                // Configuración muy permisiva para evitar bloqueos SSL
                $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true,
                        'disable_compression' => true,
                        'SNI_enabled' => false,
                        'ciphers' => 'HIGH:!SSLv2:!SSLv3'
                    )
                );
                
                $mail->isSMTP();
                $mail->Host = $config['host'];
                $mail->SMTPAuth = $config['auth'];
                $mail->Username = $config['username'];
                $mail->Password = $config['password'];
                
                if ($config['secure'] === 'ssl') {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                } elseif ($config['secure']) {
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                }
                
                $mail->Port = $config['port'];
                $mail->Timeout = $config['timeout'];
                $mail->SMTPDebug = 0;
                
                // Configuración más simple del remitente
                $mail->setFrom('info@magiadelpoas.com', 'Magia del Poas');
                $mail->addAddress(trim($email));
                
                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                $mail->Subject = "Confirmación Reserva #" . $reservaId . " - Magia del Poas";
                
                // Mensaje más simple para evitar filtros de spam
                $simpleMessage = self::createSimpleMessage($name, $message, $reservaId);
                $mail->Body = $simpleMessage;
                
                $mail->send();
                
                error_log("Email enviado exitosamente usando fallback " . ($index + 1) . " a: " . $email);
                return true;
                
            } catch (Exception $e) {
                error_log("Error en fallback " . ($index + 1) . ": " . $e->getMessage());
                
                // Si es el último intento, notificar al administrador
                if ($index === count($fallbackConfigs) - 1) {
                    self::notifyAdminEmailFailure($name, $email, $reservaId, $originalError, $e->getMessage());
                }
                
                continue;
            }
        }
        
        return false;
    }
    
    /**
     * Crea un mensaje HTML simple para evitar filtros de spam
     * @param string $name Nombre del cliente
     * @param string $message Mensaje HTML original
     * @param int $reservaId ID de la reserva
     * @return string Mensaje HTML simplificado
     */
    private static function createSimpleMessage($name, $message, $reservaId) {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;'>
            <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                <div style='text-align: center; margin-bottom: 30px;'>
                    <h1 style='color: #333; margin: 0; font-size: 24px;'>Magia del Poas</h1>
                    <p style='color: #666; margin: 5px 0 0 0; font-size: 14px;'>Hotel y Cabañas</p>
                </div>
                
                <div style='border-left: 4px solid #4CAF50; padding-left: 20px; margin-bottom: 30px;'>
                    <h2 style='color: #333; margin: 0 0 10px 0; font-size: 20px;'>¡Reserva Confirmada!</h2>
                    <p style='color: #666; margin: 0; font-size: 16px;'>Estimado(a) " . htmlspecialchars($name) . "</p>
                </div>
                
                " . $message . "
                
                <div style='margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px; text-align: center;'>
                    <p style='margin: 0 0 10px 0; color: #333; font-weight: bold;'>¿Necesita ayuda?</p>
                    <p style='margin: 0; color: #666; font-size: 14px;'>
                        📧 info@magiadelpoas.com<br>
                        📱 WhatsApp: +506 8723-4000
                    </p>
                </div>
            </div>
        </div>";
    }
    
    /**
     * Envía email usando la función mail() de PHP como último recurso
     * @param string $name Nombre del cliente
     * @param string $email Email del cliente
     * @param string $message Mensaje HTML
     * @param int $reservaId ID de la reserva
     * @return bool
     */
    private static function sendEmailWithPHPMail($name, $email, $message, $reservaId) {
        try {
            $to = trim($email);
            $subject = "Confirmacion Reserva #" . $reservaId . " - Magia del Poas";
            
            // Headers básicos
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= "From: info@magiadelpoas.com" . "\r\n";
            $headers .= "Reply-To: info@magiadelpoas.com" . "\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();
            
            // Mensaje simple en texto plano como fallback
            $plainMessage = "
            Estimado(a) " . $name . ",
            
            Su reserva #" . $reservaId . " ha sido confirmada exitosamente.
            
            Para más información, contáctenos:
            Email: info@magiadelpoas.com
            WhatsApp: +506 8723-4000
            
            Gracias por elegir Magia del Poas.
            ";
            
            $sent = mail($to, $subject, $plainMessage, $headers);
            
            if ($sent) {
                error_log("Email enviado exitosamente usando PHP mail() a: " . $email);
                return true;
            } else {
                error_log("Error al enviar email con PHP mail() a: " . $email);
                return false;
            }
            
        } catch (Exception $e) {
            error_log("Error en sendEmailWithPHPMail: " . $e->getMessage());
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
        $timestamp = date('Y-m-d H:i:s');
        
        // Logging detallado para análisis
        error_log("================== ALERTA EMAIL FALLIDO ==================");
        error_log("Timestamp: " . $timestamp);
        error_log("Reserva ID: " . $reservaId);
        error_log("Cliente: " . $name);
        error_log("Email: " . $email);
        error_log("Error principal: " . $originalError);
        error_log("Error fallback: " . $fallbackError);
        error_log("User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'No disponible'));
        error_log("IP Cliente: " . ($_SERVER['REMOTE_ADDR'] ?? 'No disponible'));
        error_log("=======================================================");
        
        // Guardar en archivo específico para emails fallidos
        $logFile = __DIR__ . '/../logs/email_failures.log';
        $logDir = dirname($logFile);
        
        // Crear directorio de logs si no existe
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logEntry = [
            'timestamp' => $timestamp,
            'reserva_id' => $reservaId,
            'cliente_nombre' => $name,
            'cliente_email' => $email,
            'error_principal' => $originalError,
            'error_fallback' => $fallbackError,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'No disponible',
            'client_ip' => $_SERVER['REMOTE_ADDR'] ?? 'No disponible'
        ];
        
        file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
        
        // Intentar enviar notificación al administrador por email (usando un proveedor diferente si es posible)
        self::sendAdminNotification($reservaId, $name, $email, $originalError);
    }
    
    /**
     * Envía notificación al administrador sobre emails fallidos
     * @param int $reservaId ID de la reserva
     * @param string $clientName Nombre del cliente
     * @param string $clientEmail Email del cliente
     * @param string $error Error ocurrido
     */
    private static function sendAdminNotification($reservaId, $clientName, $clientEmail, $error) {
        try {
            // Usar función mail() simple para notificar al admin
            $adminEmail = 'magiadelpoas@gmail.com'; // Email alternativo del administrador
            $subject = 'ALERTA: Fallo envío email confirmación reserva #' . $reservaId;
            
            $message = "
            ALERTA: No se pudo enviar email de confirmación de reserva
            
            Detalles:
            - Reserva ID: {$reservaId}
            - Cliente: {$clientName}
            - Email cliente: {$clientEmail}
            - Error: {$error}
            - Fecha: " . date('Y-m-d H:i:s') . "
            
            ACCIÓN REQUERIDA:
            1. Contactar al cliente manualmente
            2. Verificar configuración SMTP
            3. Revisar logs del servidor
            
            Sistema de Reservas - Magia del Poas
            ";
            
            $headers = "From: sistema@magiadelpoas.com\r\n";
            $headers .= "Reply-To: sistema@magiadelpoas.com\r\n";
            $headers .= "X-Priority: 1\r\n"; // Alta prioridad
            
            mail($adminEmail, $subject, $message, $headers);
            
        } catch (Exception $e) {
            error_log("Error al enviar notificación al administrador: " . $e->getMessage());
        }
    }
    
    /**
     * Método para reintentar envío de emails fallidos (para usar manualmente)
     * @param int $reservaId ID de la reserva
     * @return bool
     */
    public static function retryFailedEmail($reservaId) {
        try {
            // Aquí podrías implementar lógica para recuperar datos de la reserva
            // y reintentar el envío de email
            error_log("Reintentando envío de email para reserva: " . $reservaId);
            
            // Por ahora solo registra el intento
            return true;
            
        } catch (Exception $e) {
            error_log("Error al reintentar envío de email: " . $e->getMessage());
            return false;
        }
    }
}
?>
