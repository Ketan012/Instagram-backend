const express = require('express');
const route = express.Router();

const controllers = require('../../Controllers');

const upload = require('../../Middleware/Upload');

const UserProfile = require('../../Models/UserProfile');
//auth controllers

const { userControllers, userProfileControllers, authControllers, userFollowingControllers } = controllers;
const { isAuthenticated, isLoggedin } = authControllers;
const { createUser, getAllUser, getUserById, updateUser, removeProfilePhoto, getUserData, userFollowers, getFollowings, getFollowers, accountPrivacy, updateUserBio } = userControllers;
const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = userProfileControllers;
const { userFollowing } = userFollowingControllers;


route.get('/users/:id', isLoggedin, isAuthenticated, getAllUser);

route.param('id', getUserById);

route.get('/userprofile/:id', isLoggedin, getUserProfile);

route.get('/:id', getUserData);

route.delete('/deleteAll', deleteAll);

route.post('/userprofile/:id' ,isLoggedin, isAuthenticated, upload.single('image') ,updateUserProfile);

route.post('/userFollowings/:id', isLoggedin, isAuthenticated, userFollowing);

route.post('/userFollowers/:id', isLoggedin, isAuthenticated, userFollowers);

route.delete('/userprofile/:id', isLoggedin, isAuthenticated, deleteUserProfile);

route.get('/following/:id/:userId', isLoggedin, isAuthenticated, getFollowings);

route.get('/follower/:id/:userId', isLoggedin, isAuthenticated, getFollowers);

route.post('/accountprivacy/:id', isLoggedin, isAuthenticated, accountPrivacy);

route.put('/update/bio/:id', isLoggedin, isAuthenticated, updateUserBio);

module.exports = route;