const express = require('express');
const route = express.Router();

const controllers = require('../../Controllers');

const upload = require('../../Middleware/Upload');

const UserProfile = require('../../Models/UserProfile');
//auth controllers
const { userControllers, userProfileControllers } = controllers;
const { createUser, getAllUser, getUserById, updateUser, removeProfilePhoto } = userControllers;
const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = userProfileControllers;

route.get('/users', getAllUser);


//TODO: to create user controllers

// route.post('/', createUser);

// route.params('/:id', getUserById);

// route.put('/:id', updateUser);

route.get('/userprofile', getUserProfile);

route.post('/userprofile/:id', upload.single('image') ,updateUserProfile);

route.delete('/userprofile/:id', deleteUserProfile);

route.delete('/deleteAll', deleteAll);
module.exports = route;