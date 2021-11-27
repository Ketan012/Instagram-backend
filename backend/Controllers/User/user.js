const User = require("./../../Models/User");
const UserFollowers = require("./../../Models/UserFollowers");
const UserFollowing = require("./../../Models/UserFollowing");
const BlockList = require("./../../Models/BlockList");
const Helper = require("../../Utils/Helper");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.json({
        data: null,
        status: "error",
        error: "No user found in database.",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUserData = (req, res) => {
  return res.json({
    data: req.profile,
    status: "success",
    error: null,
  });
};

exports.getAllUser = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.json({
        data: null,
        status: "error",
        error: "No user found.",
      });
    }
    return res.json({
      data: users,
      status: "success",
      error: null,
    });
  });
};

exports.userFollowers = (req, res) => {
  const { userId, follower_id } = req.body;

  if (!follower_id || "") {
    return res.json({
      data: null,
      status: "error",
      error: "Follower userId is not provided.",
    });
  }

  if (!userId || "") {
    return res.json({
      data: null,
      status: "error",
      error: "Userid is required.",
    });
  }

  if (!Helper.isMongoId(userId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is invalid.",
    });
  }

  if (!Helper.isMongoId(follower_id)) {
    return res.json({
      data: null,
      status: "error",
      error: "Follower userid is invalid.",
    });
  }

  if (userId === follower_id) {
    return res.json({
      data: null,
      status: "error",
      error: "You cannot follow userself.",
    });
  }

  const newFollower = new UserFollowers(req.body);
  UserFollowers.findOne(
    { userId: userId, follower_id: follower_id },
    (err, userData) => {
      if (err) {
        return res.json({
          data: null,
          status: "error",
          error: "Not able to find a user.",
        });
      }

      if (userData) {
        return res.json({
          data: null,
          status: "error",
          error: "this user is already following you.",
        });
      }

      User.findOne({ _id: userId }, (err, user) => {
        if (err || !user) {
          return res.json({
            data: null,
            status: "error",
            error: "User not found in database.",
          });
        }

        User.findOne({ _id: follower_id }, (err, userfollower) => {
          if (err || !userfollower) {
            return res.json({
              data: null,
              status: "error",
              error: "Follower user not found in database.",
            });
          }
          newFollower.save((err, user) => {
            if (err) {
              return res.json({
                data: null,
                status: "error",
                error: "facing problem.",
              });
            }

            return res.json({
              data: `${follower_id} is following you.`,
              status: "success",
              error: null,
            });
          });
        });
      });
    }
  );
};

exports.getFollowings = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is required.",
    });
  }

  if (!Helper.isMongoId(userId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is invalid.",
    });
  }

  UserFollowing.find({ userId: userId }, (err, followings) => {
    if (err) {
      return res.json({
        data: null,
        status: "error",
        error: "there is error while fetching user followings.",
      });
    }

    if (followings) {
      return res.json({
        data: {
          data: followings,
          count: followings.length,
        },
        status: "success",
        error: null,
      });
    }
  });
};

exports.getFollowers = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is required.",
    });
  }

  if (!Helper.isMongoId(userId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is invalid.",
    });
  }

  UserFollowers.find({ userId: userId }, (err, followers) => {
    if (err) {
      return res.json({
        data: null,
        status: "error",
        error: "there is error while fetching user followers.",
      });
    }

    if (followers) {
      return res.json({
        data: {
          data: followers,
          count: followers.length,
        },
        status: "success",
        error: null,
      });
    }
  });
};

exports.accountPrivacy = (req, res) => {
  const { isPrivate: isPrivateInputBody } = req.body;

  const { isPrivate } = req.profile;

  if (isPrivateInputBody && isPrivate && isPrivateInputBody === isPrivate) {
    return res.json({
      data: null,
      status: "error",
      error: "Your account is already private.",
    });
  }

  if (!isPrivateInputBody && !isPrivate && isPrivateInputBody === isPrivate) {
    return res.json({
      data: null,
      status: "error",
      error: "Your account is already public.",
    });
  }

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: { isPrivate: isPrivateInputBody } },
    (err, updateduser) => {
      if (err) {
        return res.json({
          data: null,
          status: "error",
          error: "Cannot update the user account privacy.",
        });
      }

      return res.json({
        data: "Account privacy updated successfully.",
        status: "success",
        error: null,
      });
    }
  );
};

exports.updateUserBio = (req, res) => {
  const { _id } = req.profile;
  const { bio } = req.body;

  User.findOneAndUpdate({ _id: _id }, { bio: bio }, (err, updatedUser) => {
    if (err) {
      return res.json({
        data: null,
        status: "error",
        error: "Cannot update the user bio.",
      });
    }

    return res.json({
      data: "Bio updated successfully.",
      status: "success",
      error: null,
    });
  });
};

exports.blockedList = (req, res) => {
  userId = req.profile._id;
  blockUserId = req.params.blockUserId;

  if (!blockUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "blockUserId is required.",
    });
  }

  if (!userId) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is required.",
    });
  }

  if (!Helper.isMongoId(userId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is invalid.",
    });
  }

  if (!Helper.isMongoId(blockUserId)) {
    return res.json({
      data: null,
      status: "error",
      error: "blockUserId is invalid.",
    });
  }

  if (userId === blockUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "You cannot block userself.",
    });
  }

  const newBlockUser = new BlockList({userId: userId, blockUserId: blockUserId});
  BlockList.findOne(
    { userId: userId, blockUserId: blockUserId },
    (err, blockUser) => {
      if (err) {
        return res.json({
          data: null,
          status: "error",
          error: "Not able to find a user.",
        });
      }
      if (blockUser) {
        return res.json({
          data: null,
          status: "error",
          error: "You have already blocked this user.",
        });
      }

      User.findOne({ _id: userId }, (err, user) => {
        if (err || !user) {
          return res.json({
            data: null,
            status: "error",
            error: "User not found in database.",
          });
        }

        User.findOne({ _id: blockUserId }, (err, blockUser) => {
          if (err) {
            return res.json({
              data: null,
              status: "error",
              error: "Unable to find Block user.",
            });
          }

          newBlockUser.save((err, user) => {
            if (err) {
              return res.json({
                data: null,
                status: "error",
                error: "Facing error while blocking user.",
              });
            }

            UserFollowers.deleteOne({ follower_id: blockUserId }, (err) => {
              if (err) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "Unable to find Block user.",
                });
              }
            });

            UserFollowing.deleteOne({ following_id: blockUserId }, (err) => {
              if (err) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "Unable to find Block user.",
                });
              }
            });

            return res.json({
              data: `You have successfully blocked this user.`,
              status: "success",
              error: null,
            });
          });
        });
      });
    }
  );
};

exports.unFollowUser = (req, res) => {
  const userId = req.profile._id;
  const { userId: blockUserId } = req.body;

  let isUnfollowSuccess = 0;

  if (!blockUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is required.",
    });
  }

  if (!Helper.isMongoId(blockUserId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is not valid.",
    });
  }

  if (userId === blockUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "You cannot unfollow yourself.",
    });
  }

  User.findOne({ _id: blockUserId }, (err, user) => {
    if (err || !user) {
      return res.json({
        data: null,
        status: "error",
        error: "User not found.",
      });
    }

    const followingQuery = { userId: userId, following_id: blockUserId };

    UserFollowing.findOne(followingQuery, (err, following_user) => {
      if (err || !following_user) {
        return res.json({
          data: null,
          status: "error",
          errorL: "You are not following this user.",
        });
      }

      UserFollowing.deleteOne(followingQuery, (err, blockuser) => {
        if (err || !blockuser) {
          return res.json({
            data: null,
            status: "error",
            error: "Facing problem while unfollowing user.",
          });
        }

        isUnfollowSuccess += 1;

        const followerQuery = { userId: blockUserId, follower_id: userId };

        UserFollowers.deleteOne(followerQuery, (err, blockuser) => {
          if (err || !blockuser) {
            return res.json({
              data: null,
              status: "error",
              error: err,
            });
          }

          return res.json({
            data: "You have successfully unfollowed this user.",
            status: "success",
            error: null,
          });
        });
      });
    });
  });
};
