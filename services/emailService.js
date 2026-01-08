import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

/**
 * Configurar el transportador de email
 */
const createTransporter = () => {
  // Verificar que las credenciales estén configuradas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('⚠️  Credenciales de email no configuradas en .env');
    return null;
  }

  const transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  return transporter;
};

/**
 * Enviar email de formulario de contacto
 * @param {Object} data - Datos del formulario
 * @returns {Promise<boolean>}
 */
export const sendContactEmail = async (data) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('No se pudo crear el transportador de email');
      return false;
    }

    const { nombre, empresa, email, telefono, mensaje, timestamp } = data;

    // Email para el administrador
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Nuevo contacto desde el sitio web - ${empresa}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #002156;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .info-row {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .label {
              font-weight: bold;
              color: #002156;
              display: inline-block;
              min-width: 120px;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 15px;
              border-left: 4px solid #c19e5c;
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 Nuevo Mensaje de Contacto</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">Nombre:</span>
                <span>${nombre}</span>
              </div>
              <div class="info-row">
                <span class="label">Empresa:</span>
                <span>${empresa}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span><a href="mailto:${email}">${email}</a></span>
              </div>
              ${telefono ? `
              <div class="info-row">
                <span class="label">Teléfono:</span>
                <span><a href="tel:${telefono}">${telefono}</a></span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Fecha:</span>
                <span>${new Date(timestamp).toLocaleString('es-PE', { 
                  timeZone: 'America/Lima',
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}</span>
              </div>
              <div class="message-box">
                <h3 style="margin-top: 0; color: #002156;">Mensaje:</h3>
                <p>${mensaje.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>Este mensaje fue enviado desde el formulario de contacto de<br>
              <strong>Comercio y Negocios Latam SAC</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Email de confirmación para el usuario
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Hemos recibido tu mensaje - Comercio y Negocios Latam SAC',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #002156;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .highlight {
              color: #c19e5c;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por contactarnos!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombre}</strong>,</p>
              
              <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
              
              <p>En <strong class="highlight">Comercio y Negocios Latam SAC</strong>, estamos comprometidos con impulsar el crecimiento de tu empresa en mercados nacionales e internacionales.</p>
              
              <p>Mientras tanto, puedes conocer más sobre nuestros servicios en nuestra página web.</p>
              
              <p>Saludos cordiales,<br>
              <strong>El equipo de Comercio y Negocios Latam SAC</strong><br>
              <em>Una empresa del Grupo CASNU</em></p>
              
              <div class="footer">
                <p><strong>Comercio y Negocios Latam SAC</strong><br>
                San Isidro, Lima, Perú<br>
                📧 info@comercionegocioslatam.com<br>
                📱 +51 969 406 930</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Enviar ambos emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    console.log(`✅ Email enviado correctamente de ${nombre} (${email})`);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return false;
  }
};

/**
 * Verificar conexión con el servidor de email
 */
export const verifyEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    if (!transporter) return false;
    
    await transporter.verify();
    console.log('✅ Conexión con servidor de email verificada');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar conexión de email:', error.message);
    return false;
  }
};
