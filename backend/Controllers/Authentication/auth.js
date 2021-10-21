const User = require('./../../Models/User');
const { validationResult } = require('express-validator');
var MailConfig = require('./../../config/email');
var nodemailer = require('nodemailer');
const Helper = require('./../../Utils/Helper');

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { username, email, displayname } = req.body;

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

exports.login = (req, res) => {
    res.json({
        message: 'login route!'
    })
}

exports.verificationCode = (req, res) => {

    const email = req.params.email;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ketan.jadhav@successive.tech',
            pass: 'Ketan@012'
        }
    });

    const OTP = Helper.generateRandomNumber();

    var mailOptions = {
        from: 'ketan.jadhav@successive.tech',
        to: email,
        subject: 'Instagram Verification Code',
        // text: <b>'That was easy!'</b>
        html: `
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
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
  <div style="background-color:#fafbfc;"><!--[if mso | IE]>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" >
  <tr>
  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]--><div style="margin:0px auto;max-width:600px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
  <tbody><tr>
  <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tr><td class="" style="vertical-align:middle;width:600px;" >
  <![endif]-->
  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
  <tbody><tr><td align="center" style="font-size:0px;padding:25px;word-break:break-word;">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
  <tbody><tr><td style="width:auto;">
  <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:30px;font-weight:bold;line-height:1;text-align:center;color:#8c1c9e;">
  Instagram
  </div>
</td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"><div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;"><span>Hello,</span></div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"><div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">Please use the verification code below on the Instagram website:</div></td></tr>
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
  <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;">
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
        `
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

exports.verifyEmail = (req, res) => {
    res.json({
        message: 'verifyEmail route!'
    })
}

exports.resetPasswordLink = (req, res) => {
    res.json({
        message: 'resetPasswordLink route!'
    })
}
