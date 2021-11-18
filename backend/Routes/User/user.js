const express = require('express');
const route = express.Router();

const controllers = require('../../Controllers');

const upload = require('../../Middleware/Upload');

const UserProfile = require('../../Models/UserProfile');
//auth controllers

const { userControllers, userProfileControllers, authControllers, userFollowingControllers } = controllers;
const { isAuthenticated, isLoggedin } = authControllers;
const { createUser, getAllUser, getUserById, updateUser, removeProfilePhoto, getUserData } = userControllers;
const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = userProfileControllers;
const { userFollowing } = userFollowingControllers;


route.get('/users/:id', isLoggedin, isAuthenticated, getAllUser);

//TODO: to create user controllers
route.param('id', getUserById);

//TODO: to create controllers

// route.post('/', createUser);

// route.put('/:id', updateUser);

route.get('/userprofile/:id', isLoggedin, getUserProfile);

route.get('/:id', getUserData);

route.post('/userprofile/:id' ,isLoggedin, isAuthenticated, upload.single('image') ,updateUserProfile);

route.post('/userFollowings/:id', isLoggedin, isAuthenticated, userFollowing);

route.delete('/userprofile/:id', isLoggedin, isAuthenticated, deleteUserProfile);

route.delete('/deleteAll', deleteAll);
module.exports = route;