import { Resend } from 'resend';

// Initialize Resend with your API key from Render
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // This MUST stay exactly like this for the free tier
            to: options.email, // This MUST be the email address you used to sign up for Resend
            subject: options.subject,
            html: options.message,
        });
        console.log('Email sent successfully via Resend:', data);
    } catch (error) {
        console.error('Resend Error:', error);
        throw new Error('Email could not be sent');
    }
};

export default sendEmail;