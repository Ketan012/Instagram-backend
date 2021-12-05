const express = require('express');
const route = express.Router();

const controllers = require('../../Controllers');

const upload = require('../../Middleware/Upload');

const UserProfile = require('../../Models/UserProfile');
//auth controllers

const { userControllers, userProfileControllers, authControllers } = controllers;
const { isAuthenticated, isLoggedin } = authControllers;
const { createUser, getAllUser, getUserById, getUserData, userFollowing, getFollowings, getFollowers, accountPrivacy, updateUserBio, blockedList, unblockUser, unFollowUser, removeFollower, updateUserData, searchUser } = userControllers;
const { updateUserProfile, getUserProfile, deleteUserProfile, deleteAll } = userProfileControllers;


route.get('/users/:id', isLoggedin, isAuthenticated, getAllUser);

route.param('id', getUserById);

route.get('/userprofile/:id', isLoggedin, getUserProfile);

route.get('/:id', getUserData);

route.delete('/deleteAll', deleteAll);

route.post('/userprofile/:id' ,isLoggedin, isAuthenticated, upload.single('image') ,updateUserProfile);

route.post('/userFollowings/:id', isLoggedin, isAuthenticated, userFollowing);

route.delete('/userprofile/:id', isLoggedin, isAuthenticated, deleteUserProfile);

route.get('/following/:id/:userId', isLoggedin, isAuthenticated, getFollowings);

route.get('/follower/:id/:userId', isLoggedin, isAuthenticated, getFollowers);

route.post('/accountprivacy/:id', isLoggedin, isAuthenticated, accountPrivacy);

route.put('/update/bio/:id', isLoggedin, isAuthenticated, updateUserBio);

route.delete('/block/:id/:blockUserId', isLoggedin, isAuthenticated, blockedList);

route.delete('/unblock/:id/:unblockUserId', isLoggedin, isAuthenticated, unblockUser);

route.delete('/unfollow/:id/:unFollowUserId', isLoggedin, isAuthenticated, unFollowUser);

route.delete('/removefollower/:id/:followerId', isLoggedin, isAuthenticated, removeFollower);

route.put('/update/data/:id', isLoggedin, isAuthenticated, updateUserData);

route.get('/search/:id', isLoggedin, isAuthenticated, searchUser);

module.exports = route;