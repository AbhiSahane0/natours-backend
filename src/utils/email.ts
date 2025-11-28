import Nodemailer from 'nodemailer'
import { MailtrapTransport } from 'mailtrap'

const sendEmail = async (options: { email: string; message: string }) => {
    const transporter = Nodemailer.createTransport(
        MailtrapTransport({
            token: process.env.EMAIL_MAILTRAP_TOKEN!,
        })
    )

    const sender = {
        address: 'hello@demomailtrap.co',
        name: 'Mailtrap Test',
    }
    const recipients = [options.email]

    transporter.sendMail({
        from: sender,
        to: recipients,
        subject: 'You are awesome!',
        text: options.message,
        category: 'Integration Test',
    })
}

export default sendEmail
