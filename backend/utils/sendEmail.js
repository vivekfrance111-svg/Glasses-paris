import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // For development, we can use ethereal.email or just log to console
    // If you have actual credentials, add them to .env

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Glasses E-Commerce'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html,
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

export default sendEmail;
