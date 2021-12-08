const {
  login,
  signup,
  sendEmail,
  verificationCodeByPhone,
  verifyEmail,
  isLoggedin,
  isAuthenticated,
} = require("./Authentication/auth");

const {
  updateUserProfile,
  getUserProfile,
  deleteUserProfile,
  deleteAll,
} = require("./User/userProfile");

const {
  getAllUser,
  getUserById,
  getUserData,
  userFollowing,
  getFollowings,
  getFollowers,
  accountPrivacy,
  updateUserBio,
  blockedList,
  unblockUser,
  unFollowUser,
  removeFollower,
  updateUserData,
  searchUser,
} = require("./User/user");

const { 
  createPost
} = require("./Post/post");

const authControllers = {
  login,
  signup,
  sendEmail,
  verificationCodeByPhone,
  verifyEmail,
  isAuthenticated,
  isLoggedin,
};

const userControllers = {
  getAllUser,
  getUserById,
  getUserData,
  userFollowing,
  getFollowings,
  getFollowers,
  accountPrivacy,
  updateUserBio,
  blockedList,
  unblockUser,
  unFollowUser,
  removeFollower,
  updateUserData,
  searchUser,
};

const userProfileControllers = {
  updateUserProfile,
  getUserProfile,
  deleteUserProfile,
  deleteAll,
};

const postControllers = {
  createPost
};

const controllers = {
  authControllers,
  userControllers,
  userProfileControllers,
  postControllers,
};

module.exports = controllers;
