const { login, signup, sendEmail, verificationCodeByPhone, verifyEmail } = require('./Authentication/auth');

const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = require('./User/userProfile');
=======
const { getAllUser, getUserById, getUserData } = require('./User/user');


const  authControllers = {
    login, signup, sendEmail, verificationCodeByPhone, verifyEmail,
};

const userControllers = {

    getAllUser, getUserById, getUserData,
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