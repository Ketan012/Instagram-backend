let nodemailer = require('nodemailer');
var fs = require('fs');

require('dotenv').config();
let environment = process.env;

module.exports.GmailTransport = nodemailer.createTransport({
    service: environment.GMAIL_SERVICE_NAME,
    auth: {
        user: environment.GMAIL_USER_NAME,
        pass: environment.GMAIL_USER_PASSWORD
    }
});

module.exports.sendMail = async function(transporter, mailOptions){
    await transporter.sendMail(mailOptions, (error, info) => {
       if(error){
           return false;
       }
       return true;
    })
}

module.exports.readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, html);
        }
    });
};
