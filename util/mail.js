const nodemailer = require('nodemailer');

exports.mail = function (message, employer, subjectEmail) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'smartboss10837@gmail.com',
                pass: 'g9ERHTxCy8rHTJT'
            }
        });

        let mailOptions = {
            from: 'smartboss10837@gmail.com',
            to: employer.email,
            subject: subjectEmail,
            text: message,
            attachments: {
                path: './Schedule.xlsx'
            }
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (e) {
        console.log(e);
    }
};
