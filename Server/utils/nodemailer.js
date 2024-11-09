const mailer = require('nodemailer');
require('dotenv').config();
class EmailSender {
    constructor() {
        this.transporter = mailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        this._from = process.env.EMAIL;
    }

    // Método para enviar correo de recuperación de contraseña
    static async sendEmailRestorePassword(email, token){
        try {
            const sender = new EmailSender(); // Crear una instancia de EmailSender
            await sender.transporter.sendMail({
                from: sender._from,
                to: email,
                subject: 'Recuperación de contraseña',
                text: `Para restablecer tu contraseña, ingresa el siguiente token en la aplicación (expira en 15 minutos): ${token}`
            });
        } catch (error) {
            console.log('Error sending email recover password: ', error);
        }
    }

    // Método para enviar correo genérico
    static async sendEmail(email, subject, text){
        try {
            const sender = new EmailSender(); // Crear una instancia de EmailSender
            await sender.transporter.sendMail({
                from: sender._from,
                to: email,
                subject: subject,
                text: text
            });
        } catch (error) {
            console.log('Error sending email: ', error);
        }
    }
    /* Implementación de función para enviar correos de archivos */
}

module.exports = EmailSender;