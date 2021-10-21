const { login, signup, verificationCode, verifyEmail, resetPasswordLink} = require('./Authentication/auth');
const  authControllers = {
    login, signup, verificationCode, verifyEmail, resetPasswordLink
};
const controllers = {
   authControllers
}

module.exports = controllers;