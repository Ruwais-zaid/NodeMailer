const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config()

const app = express();
const port = 8000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' }); 

// Route to handle contact form submission with file upload
app.post('/', upload.single('resume'), async (req, res) => {
    const { name, tel, email, subject, message, position } = req.body;
    const resume = req.file;

    // Log the form data and file for debugging purposes
    console.log('Contact Form Data:', { name, tel, email, subject, message, position });
    console.log('Uploaded Resume:', resume);

    // Validate the required fields
    if (!name || !email || !message || !position || !resume) {
        return res.status(400).json({ error: 'Name, email, message, position, and resume are required.' });
    }

    // Nodemailer transport configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail service
        auth: {
            user: process.env.USER_ACCOUNT, // Give your gmail account other than this
            pass: process.env.USER_PASS // Give your app password other than this
        }
    });

    // Define email options
    const mailOptions = {
        from: 'psmaantest@gmail.com', // Sender address
        to: email,
        position:position, // Your email address to receive the form data
        subject: `New Contact Form Submission from ${name}`, // Email subject
        text: `You have a new message from ${name} (${email}, Tel: ${tel})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\nPosition: ${position}`,
        attachments: [
            {
                filename: resume.originalname,
                path: resume.path
            }
        ]
    };

    try {
        // Send the email using Nodemailer
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        // Remove the file from the server after sending the email
        fs.unlink(resume.path, (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Basic route to check server status
app.get('/', (req, res) => {
    res.send("Hello, world!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
