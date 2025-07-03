const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // ¡Esto debe ser literal!
    pass: process.env.SENDGRID_API_KEY
  }
});

async function enviarCodigo(destinatario, codigo) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: destinatario,
    subject: 'Código de verificación - GeoUser',
    text: `Tu código de verificación es: ${codigo}`
  });
}

module.exports = { enviarCodigo };
