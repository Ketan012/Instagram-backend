const { login, signup, sendEmail, verificationCodeByPhone, verifyEmail } = require('./Authentication/auth');
const { getAllUser } = require('./User/user');

const  authControllers = {
    login, signup, sendEmail, verificationCodeByPhone, verifyEmail,
};

const userControllers = {
    getAllUser,
}

const controllers = {
   authControllers,
   userControllers
}

module.exports = controllers;