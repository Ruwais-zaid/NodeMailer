const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises; // Use promises version for async/await

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://node-mailer-gxxv.vercel.app/", // Allow all origins for testing
    methods: ["POST", "GET", "OPTIONS"], // Allow all methods you need
    credentials: true,
}));

// Setup multer for file uploads
const upload = multer({ dest: '/tmp/' }); // Use /tmp/ as temporary storage in serverless environments

app.post('/', upload.single('resume'), async (req, res) => {
    const { name, tel, email, subject, message, position } = req.body;
    const resume = req.file;

    if (!name || !email || !message || !position || !resume) {
        return res.status(400).json({ error: 'Name, email, message, position, and resume are required.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_ACCOUNT,
            pass: process.env.USER_PASS
        }
    });

    const mailOptions = {
        from: 'xxxyz96989@gmail.com',
        to: email,
        subject: `New Contact Form Submission from ${name}`,
        text: `You have a new message from ${name} (${email}, Tel: ${tel})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\nPosition: ${position}`,
        attachments: [
            {
                filename: resume.originalname,
                path: resume.path
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        await fs.unlink(resume.path);
        console.log('File deleted successfully');

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

app.get('/', (req, res) => {
    res.send("Hello My name is zaid")
});

// Export the app for Vercel
module.exports = app;
