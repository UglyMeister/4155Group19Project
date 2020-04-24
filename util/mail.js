const nodemailer = require('nodemailer');

//asks for a message, the recipient in the form of a mongodb entry (probably should make it as an email
//instead will do later), the subject of the email, and a file path unless there is no file then it is false
exports.mail = function (message, recipient, subjectEmail, filePath) {
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
        let mailOptions;
        //If there is an file goes to first otherwise goes to second
        if (filePath) {
            mailOptions = {
                from: 'smartboss10837@gmail.com',
                to: recipient.email,
                subject: subjectEmail,
                text: message,
                attachments: {
                    path: filePath
                }
            };
        } else {
            mailOptions = {
                from: 'smartboss10837@gmail.com',
                to: recipient.email,
                subject: subjectEmail,
                text: message
            };
        }

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
