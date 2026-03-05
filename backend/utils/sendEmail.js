import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: options.email,
            subject: options.subject,
            html: options.message,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

export default sendEmail;
