const express = require('express');
const route = express.Router();

const { check } = require('express-validator');
const controllers = require('./../../Controllers');

//auth controllers
const { authControllers } = controllers;
const { signup, login, sendEmail, verificationCodeByPhone, verifyEmail } = authControllers;

route.post('/signup', [
    check('username', 'username should be at least 3 characters long.').isLength({min: 3}),
    check('username', 'username should be maximum 15 characters long.').isLength({max: 15}),
    check('displayname', 'displayname should be at least 3 characters long.').isLength({min: 3}),
    check('displayname', 'displayname should be maximum 15 characters long.').isLength({max: 15}),
    check('email', 'email is required.').isEmail(),
    check('password', 'password should be at least 6 characters long.').isLength({min: 6}),
    
], signup);

route.post('/login', login);

route.get('/sendmail/email/:isReset/:email', sendEmail);

route.get('/verificationcode/phone/:phone', verificationCodeByPhone);

route.get('/verifyemail/:email', verifyEmail);

//TODO: move to user route
// route.put('/updatepassword', updatePassword);

module.exports = route;