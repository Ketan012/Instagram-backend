const express = require('express');
const route = express.Router();

const upload = require('../../Middleware/Upload');

const controllers = require('../../Controllers');

const { authControllers, userControllers, postControllers } = controllers;

const { isLoggedin, isAuthenticated } = authControllers;

const { getUserById } = userControllers;

const { createPost } = postControllers;

route.param(':id', getUserById);

route.post('/create/:id', isLoggedin, isAuthenticated, upload.single('content'), createPost);

module.exports = route;