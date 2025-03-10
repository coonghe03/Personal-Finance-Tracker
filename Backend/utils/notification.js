const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "pahitharandilakshan@gmail.com",
        pass: "sqcu plul lmtg eqdg",
    },
});

async function sendNotification(email, message) {
    const mailOptions = {
        from: "pahitharandilakshan@gmail.com",
        to: email,
        subject: "Transaction Reminder",
        text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${email}`);
}

module.exports = sendNotification;
