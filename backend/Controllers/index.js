const { login, signup, sendEmail, verificationCodeByPhone, verifyEmail } = require('./Authentication/auth');
const { getAllUser, getUserById, getUserData } = require('./User/user');

const  authControllers = {
    login, signup, sendEmail, verificationCodeByPhone, verifyEmail,
};

const userControllers = {
    getAllUser, getUserById, getUserData,
}

const controllers = {
   authControllers,
   userControllers
}

module.exports = controllers;