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
        $name = htmlentities($reservaData['nombreCliente_reserva']);
        $email = htmlentities($reservaData['emailCliente_reserva']);
        $phone = htmlentities($reservaData['telefono_reserva'] ?? '00');
        $cabanaName = htmlentities($reservaData['cabanaNombre_reserva']);
        $deposito = htmlentities($reservaData['deposito_reserva']);
        $horaIngreso = htmlentities($reservaData['horaIngreso_reserva']);
        $horaSalida = htmlentities($reservaData['horaSalida_reserva']);
        $fechaIngreso = htmlentities($reservaData['fechaIngreso_reserva']);
        $fechaSalida = htmlentities($reservaData['fechaSalida_reserva']);
        $cantidadPersonas = htmlentities($reservaData['cantidadPersonas_reserva']);
        $mascotas = htmlentities($reservaData['mascotas_reserva']);
        $reservaId = htmlentities($reservaData['id_reserva']);
        
        return "<span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> #Reserva : </b>" . $reservaId . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Cabaña : </b>" . $cabanaName . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Nombre : </b>" . $name . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Correo: </b>" . $email . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Teléfono : </b>" . $phone . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Depósito : </b>" . $deposito . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Hora de ingreso : </b>" . $horaIngreso . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Hora de salida : </b>" . $horaSalida . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Check in : </b>" . $fechaIngreso . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b> Check out : </b>" . $fechaSalida . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b>Cantidad Personas : </b>" . $cantidadPersonas . "</span><br>
    <span style='padding-top:0;padding-bottom:0;font-size:14px;display:block;padding-left:25px'><b>Mascotas: </b>" . $mascotas . "</span><br>";
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
        // Instantiation and passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                    'allow_self_signed' => true
                )
            );
            $mail->SMTPDebug = 0; // Enable verbose debug output
            $mail->isSMTP(); // Send using SMTP
            $mail->Host = 'smtp.hostinger.com'; // Set the SMTP server to send through
            $mail->SMTPAuth = true; // Enable SMTP authentication
            $mail->Username = 'info@magiadelpoas.com'; // Sender's email address
            $mail->Password = 'Npls1234!'; // SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->From = 'info@magiadelpoas.com';
            $mail->FromName = 'MAGIA DEL POAS';
            $mail->addAddress($email);
            //$mail->addCC('magiadelpoas@gmail.com', 'MAGIA DEL POAS');
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = "Reserva Confirmada - " . utf8_decode($name);

            // Mensaje personalizado
            $messageFormatted = '<table><tr><td>' . $message . '</td></tr></table>';

            $template = '
              <div id=":mv" class="a3s aiL">
                  <img width="200px" height="auto"src=" https://sistema.magiadelpoas.com/logo.png" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:W2ZhbHNlLDJd">
                  <br><br><br>Estimado(a) Cliente <strong>{name}</strong><br><br> ¡Su reserva ha sido confirmada exitosamente!<br><br><br>
                  {message}<br><div class="yj6qo"></div>
                  
               <p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center"> Si la información brindada no es la correcta, comunícate con nosotros <a href="https://wa.me/50687234000?text=Hola%20,%20revisando%20mi%20correo%20,%20veo%20que%20la%20información%20está%20incorrecta%20NReserva:%20' . $reservaId . '">Whatsapp</a></p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center"><strong>Política de cancelación.</strong></p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:left">1. Las cancelaciones deben hacerse por escrito y enviadas por correo electrónico a la dirección info@magiadelpoas.com,
además, todas las cancelaciones deben ser confirmadas como recibidas por Magia del Poas, para ser consideradas como válidas.</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:left">3. Cancelaciones solicitadas 7 días antes de la fecha de llegada, están libres de penalización. Las cancelaciones solicitadas
entre 6 y 3 días antes de la fecha de llegada están sujetas a una penalización del 50% correspondiente al importe total
pagado originalmente.</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:left">4. Las cancelaciones solicitadas en entre el día 3 y 0 previo a su ingreso, están sujetas a una penalización del 100%
correspondiente al importe total pagado originalmente.</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:left">5. Tarifa Transferible En Temporada Alta Y Baja: Para cancelaciones solicitadas 7 días antes de la fecha de llegada
reciba un crédito de estadía transferible a usar en los próximos 6 meses.</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:left">6. Reservaciones donde el reservante no se presente, decida no hacer uso de la habitación y/o decida salir de manera prematura
no son reembolsables, independientemente de la temporada.</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center">¡te esperamos pronto!</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center"> <a href="https://goo.gl/maps/YXgyPfKbJWHpSXgP6"><img style="max-width: 100px ; height: 30px;" src="https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLQiGGbnuyP6HBNax43YShXti9THPon1YKB6zPYpA"></a></p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center"> Ir con maps</p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center"><a href="https://www.waze.com/en/live-map/directions/cr/provincia-de-alajuela/magia-del-poas?navigate=yes&place=ChIJxSzYulX1oI8R1fz2JmE088s"><img style="max-width: 100px ; height: 30px;" src="https://i0.wp.com/elpoderdelasideas.com/wp-content/uploads/waze-logo-detalles.png?resize=800%2C400"></a></p>
<p style="font-size:12px;margin-bottom:10px;color:#737373;text-align:center">Ir con waze</p>

                  <div class="adL"><br></div>
              </div>';

            $search = ['{name}', '{message}'];
            $replace = [utf8_decode($name), $messageFormatted];
            $mensaje = str_replace($search, $replace, utf8_decode($template));
            $mail->Body = $mensaje;
            
            $mail->send();
            
            error_log("Email de confirmación enviado exitosamente a: " . $email);
            return true;
            
        } catch (Exception $e) {
            error_log("Error al enviar email de confirmación: " . $e->getMessage());
            return false;
        }
    }
}
?>
