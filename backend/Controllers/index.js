const { login, signup, sendEmail, verificationCodeByPhone, verifyEmail, isLoggedin, isAuthenticated } = require('./Authentication/auth');

const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = require('./User/userProfile');

const { getAllUser, getUserById, getUserData, userFollowers, getFollowings, getFollowers, accountPrivacy } = require('./User/user');

const { userFollowing } = require('./User/userFollowing');

const  authControllers = {
    login, signup, sendEmail, verificationCodeByPhone, verifyEmail, isAuthenticated, isLoggedin
};

const userControllers = {

    getAllUser, getUserById, getUserData, userFollowers, getFollowings, getFollowers, accountPrivacy
}

const userProfileControllers = {
    updateUserProfile, getUserProfile, deleteUserProfile, deleteAll
}

const userFollowingControllers = {
    userFollowing
}

const controllers = {
   authControllers,
   userControllers,
   userProfileControllers,
   userFollowingControllers
}

module.exports = controllers;