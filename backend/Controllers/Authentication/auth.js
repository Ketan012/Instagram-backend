const User = require('./../../Models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Helper = require('./../../Utils/Helper');
const Vonage = require('@vonage/server-sdk')
const { GmailTransport, sendMail, readHTMLFile } = require('./../../config/email');
var handlebars = require('handlebars');

require('dotenv').config();

const vonage = new Vonage({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
})

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { username, email } = req.body;

    User.findOne({ username }, (err, user) => {
        if (user) {
            return res.status(400).json({
                data: null,
                status: 'error',
                error: 'username is already exists!'
            })
        }

        User.findOne({ email }, (err, user) => {
            if (user) {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: 'email is already exists!'
                })
            }

            const newUser = new User(req.body);
            newUser.save((err, user) => {
                if (err) {
                    return res.status(400).json({
                        data: null,
                        status: 'error',
                        error: err
                    })
                }
                return res.json({
                    data: {
                        username: user.username,
                        email: user.email
                    },
                    status: 'success',
                    error: null
                })
            })

        });
    });
}


exports.sendEmail = (req, res) => {

    const email = req.params.email;
    const isReset = Number(req.params.isReset);
    let Subject = '';
    var transporter = GmailTransport;

    if (isReset === 1) {
        Subject = 'Rest Password Link'
        readHTMLFile(__dirname + '/./../../views/email/resetLinkTemplate.html', function (err, html) {

            if (err) {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: err
                })
            }
            var mailOptions = {
                from: process.env.GMAIL_USER_NAME,
                to: email,
                subject: Subject,
                html: html
            };

            if (!Boolean(sendMail(transporter, mailOptions))) {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: 'Mail sent failed!'
                })
            }
            return res.status(200).json({
                data: 'Mail sent successfully!',
                status: 'success',
                error: null
            })
        });

    }
    else {
        const OTP = Helper.generateRandomNumber();
        Subject = 'Instagram Verification Code';
        readHTMLFile(__dirname + '/./../../views/email/verificationCodeTemplate.html', function (err, html) {
            if (err) {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: err
                })
            }
            var template = handlebars.compile(html);
            var replacements = {
                OTP: OTP
            };
            var htmlToSend = template(replacements);

            var mailOptions = {
                from: process.env.GMAIL_USER_NAME,
                to: email,
                subject: Subject,
                html: htmlToSend
            };

            if (!Boolean(sendMail(transporter, mailOptions))) {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: 'Mail sent failed!'
                })
            }
            return res.status(200).json({
                data: 'Mail sent successfully!',
                status: 'success',
                error: null
            })
        });
    }
}

exports.verificationCodeByPhone = (req, res) => {
    const from = "Instagram"
    const to = req.params.phone
    const OTP = Helper.generateRandomNumber();
    const text = `Hello from Instagram, This is your verification code: ${OTP}. Valid for 10 minutes.`

    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            return res.status(400).json({
                data: null,
                status: 'error',
                error: err
            })
        } else {
            if (responseData.messages[0]['status'] === "0") {
                return res.status(200).json({
                    data: 'Message sent successfully!',
                    status: 'success',
                    error: null
                })
            } else {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: `Message failed with error: ${responseData.messages[0]['error-text']}`
                })
            }
        }
    })
}


exports.login = (req, res) => {
    const { username, password } = req.body;

    const isEmail = Helper.isValidEmail(username);

    const query = isEmail ? { 'email': username } : { 'username': username };
    User.findOne(query, (err, user) => {
        if (err || !user) {
            return res.status(404).json({
                data: null,
                status: 'error',
                error: 'User not found.'
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                data: null,
                status: 'error',
                error: 'username and password do not match'
            })
        }

        const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, 'SECRET');

        return res.status(200).json({
            data: token,
            status: 'success',
            error: null
        })

    })
}


exports.verifyEmail = (req, res) => {

    const isEmail = Helper.isValidEmail(String(req.params.email));

    const query = isEmail ? { 'email': String(req.params.email) } : { 'username': String(req.params.email) };

    console.log("isEmail: ", isEmail);
    console.log("email: ", req.params.email);
    User.findOne(query, (err, users) => {
        if (err || !users) {
            return res.status(404).json({
                data: false,
                status: 'error',
                error: 'User not found.'
            })
        }
        return res.status(200).json({
            data: true,
            status: 'success',
            error: null
        })
    })
}
