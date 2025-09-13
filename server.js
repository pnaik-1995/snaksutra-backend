import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer'
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json())


app.post("/contact", async (req, res) => {
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
    let { name, email, phone } = req.body

    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,   // your email
            to: process.env.RECEIVER_EMAIL, // your email (where you want to receive contact messages)
            subject: `Contact form submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
            `,
            replyTo: email, // so when you hit reply, it goes to the user
        };

        await transport.sendMail(mailOptions);

        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
