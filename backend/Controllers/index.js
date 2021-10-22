const { login, signup, sendEmail, verificationCodeByPhone, verifyEmail, resetPasswordLink} = require('./Authentication/auth');
const  authControllers = {
    login, signup, sendEmail, verificationCodeByPhone, verifyEmail, resetPasswordLink
};
const controllers = {
   authControllers
}

module.exports = controllers;