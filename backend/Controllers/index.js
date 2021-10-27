const { login, signup, sendEmail, verificationCodeByPhone, verifyEmail } = require('./Authentication/auth');
const { getAllUser } = require('./User/user');
const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = require('./User/userProfile');

const  authControllers = {
    login, signup, sendEmail, verificationCodeByPhone, verifyEmail,
};

const userControllers = {
    getAllUser, 
}

const userProfileControllers = {
    updateUserProfile, getUserProfile, deleteUserProfile, deleteAll
}

const controllers = {
   authControllers,
   userControllers,
   userProfileControllers
}

module.exports = controllers;