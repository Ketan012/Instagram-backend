const express = require('express');
const route = express.Router();

const controllers = require('./../../Controllers');

//auth controllers
const { authControllers } = controllers;
const { signup, login, verificationCode, verifyEmail, resetPasswordLink } = authControllers;

route.post('/signup', signup);

route.get('/login', login);

route.get('/verificationcode', verificationCode);

route.get('/verifyemail', verifyEmail);

route.get('/resetpasswordlink', resetPasswordLink);

//TODO: move to user route
// route.put('/updatepassword', updatePassword);

module.exports = route;