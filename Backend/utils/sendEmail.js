import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'email', // Use your email service (e.g., Outlook, Yahoo, etc.)
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your email password or App Password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

console.log('Email:', process.env.EMAIL_USER, 'Password:', process.env.EMAIL_PASS);

export default sendEmail;
