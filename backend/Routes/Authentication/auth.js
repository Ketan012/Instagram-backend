const express = require('express');
const route = express.Router();

const { check } = require('express-validator');
const controllers = require('./../../Controllers');

//auth controllers
const { authControllers } = controllers;
const { signup, login, verificationCode, verifyEmail, resetPasswordLink } = authControllers;

route.post('/signup', [
    check('username', 'username should be at least 3 characters long.').isLength({min: 3}),
    check('username', 'username should be maximum 15 characters long.').isLength({max: 15}),
    check('email', 'email is required.').isEmail(),
    check('password', 'password should be at least 6 characters long.').isLength({min: 6}),
    
], signup);

route.get('/login', login);

route.get('/verificationcode', verificationCode);

route.get('/verifyemail', verifyEmail);

route.get('/resetpasswordlink', resetPasswordLink);

//TODO: move to user route
// route.put('/updatepassword', updatePassword);

module.exports = route;