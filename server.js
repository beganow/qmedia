const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.json());
server.use(cors({
    origin: '*',
}));

server.post('/api/form', (req, res) => {
    const { name, email, seminar } = req.body;

    if (email === 'Pashok12.obodov@gmail.com') {
        return res.status(403).send({ success: false, message: 'User is not authorized to send emails.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adamqmedia68@gmail.com',
            pass: 'pwchkrwdnjbssdfu',
        },
    });

    const mailOptions = {
        from: 'adamqmedia68@gmail.com',
        to: email,
        subject: 'Подтверждение регистрации на семинар',
        text: `Здравствуйте, ${name}!\n\nВы успешно зарегистрированы на семинар:${seminar}.\n\nС уважением,\nКоманда семинара`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ success: false, message: error.toString() });
        }
        res.send({ success: true, message: 'Email sent: ' + info.response });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});