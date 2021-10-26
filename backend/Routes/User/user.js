const express = require('express');
const route = express.Router();

const { check } = require('express-validator');
const controllers = require('../../Controllers');

//auth controllers
const { userControllers, authControllers } = controllers;
const { createUser, getAllUser, getUserById, getUserData, updateUser, getUserProfile, updateUserProfile, removeProfilePhoto } = userControllers;

route.param('id', getUserById);

route.get('/users', getAllUser);

route.get('/:id', getUserData);
//TODO: to create controllers

// route.post('/', createUser);

// route.put('/:id', updateUser);

// route.get('/:id', getUserProfile);

// route.put('/:id', updateUserProfile);

// route.delete('/:id', removeProfilePhoto);

module.exports = route;