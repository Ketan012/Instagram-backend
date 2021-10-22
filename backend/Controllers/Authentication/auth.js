const User = require('./../../Models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const Helper = require('./../../Utils/Helper');
const Vonage = require('@vonage/server-sdk')

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
    let html = '';
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'officialinstagramhandler@gmail.com',
            pass: 'Instagram@012'
        }
    });

    if(isReset === 1){
        Subject = 'Rest Password Link'
        html = `<p><a href="www.google.com">click here</a> to reset your password</p>`
    }
    else{
    const OTP = Helper.generateRandomNumber();
        Subject = 'Instagram Verification Code';
        html = `
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>
        </title>
        <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
        body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
        table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
        img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
        p { display:block;margin:13px 0; }</style><!--[if mso]>
      <noscript>
      <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      </noscript>
      <![endif]--><!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix { width:100% !important; }
      </style>
      <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
      .mj-column-per-100 { width:100% !important; max-width: 100%; }
    }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">@media only screen and (max-width:480px) {
    table.mj-full-width-mobile { width: 100% !important; }
    td.mj-full-width-mobile { width: auto !important; }
  }</style></head><body style="word-spacing:normal;background-color:#fafbfc;">
  <div style="background-color:#fafbfc;padding-bottom:25px;"><!--[if mso | IE]>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" >
  <tr>
  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]--><div style="margin:0px auto;max-width:600px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
  <tbody>
  <tr>
  <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tr><td class="" style="vertical-align:middle;width:600px;" >
  <![endif]-->
  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
  

  <!--[if mso | IE]></td></tr></table>
  <![endif]-->
  </td>
  </tr>
  </tbody>
  </table>
  </div>
  <!--[if mso | IE]></td></tr></table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" >
  <tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]-->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
  <tbody>
  <tr>
  <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tr>
  <td class="" style="vertical-align:middle;width:600px;" >
  <![endif]-->
  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:center;display:inline-block;vertical-align:middle;width:100%;margin-bottom:10px">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
  <tbody>
  <tr>
  <td align="center"
  style="font-size:0px;padding:10px 25px;
  padding-right:25px;padding-left:25px;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">
  <img height="auto" src="https://cdn.exclaimer.com/Handbook%20Images/instagram-icon_128x128.png?_ga=2.150766582.1962397864.1634893216-1786215437.1634893215" 
  style="
                border:0;text-decoration:none;height:auto;
                width:70px;font-size:13px;"
                margin-left:auto;
                align="center"
                />
  </div>
  </div>
  </td>
  </tr>
  <tr>
  <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">
  <span>Hello,</span>
  </div>
  </td>
  </tr>
  <tr>
  <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">
  Please use the verification code below on the Instagram:
  </div>
  </td>
  </tr>
  <tr>
  <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
  ${OTP}
  </div>
  </td>
  </tr>
  <tr>
  <td align="center" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">
  If you didn't request this, you can ignore this email or let us know.
  </div>
  </td>
  </tr>
  <tr>
  <tr>
  <td align="center" style="font-size:0px;padding:10px 25px;padding-right:16px;padding-left:25px;word-break:break-word;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">
  This OTP is only valid for 10 minutes.
  </div>
  </td>
  </tr>
  <tr>
  <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;margin-bottom:20px">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">
  Thanks!
  <br>
  Instagram team
  </div>
  </td>
  </tr>
  </tbody>
  </table>
  </div>
  <!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>
        `;
    }

    var mailOptions = {
        from: 'officialinstagramhandler@gmail.com',
        to: email,
        subject: Subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(400).json({
                data: null,
                status: 'error',
                error: error
            })
        }
        return res.status(200).json({
            data: 'Mail sent successfully!',
            status: 'success',
            error: null
        })
    })
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

    const query = isEmail ? {'email': username} : {'username': username};
        User.findOne(query, (err,user)=>{
            if(err || !user){
                return res.status(404).json({
                    data: null,
                    status: 'error',
                    error: 'User not found.'
                })
            }

            if(!user.authenticate(password)){
                return res.status(401).json({
                    data: null,
                    status: 'error',
                    error: 'username and password do not match'
                })
            }

            const token = jwt.sign({_id: user._id, email: user.email, username: user.username}, 'SECRET');

            return res.status(200).json({
                data: token,
                status: 'success',
                error: null
            })

        })
}


exports.verifyEmail = (req, res) => {

    const isEmail = Helper.isValidEmail(String(req.params.email));

    const query = isEmail ? {'email': String(req.params.email)} : {'username': String(req.params.email)};

    console.log("isEmail: ",isEmail);
    console.log("email: ",req.params.email);
   User.findOne(query, (err, users)=>{
       if(err || !users){
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
