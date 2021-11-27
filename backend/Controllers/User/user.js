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

exports.userFollowing = (req, res) => {
  userId = req.body.userId;
  following_id = req.body.following_id;

  if (!following_id || "") {
    return res.json({
      data: null,
      status: "error",
      error: "Following userId is required.",
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

  if (!Helper.isMongoId(following_id)) {
    return res.json({
      data: null,
      status: "error",
      error: "Following userid is invalid.",
    });
  }

  if (userId === following_id) {
    return res.json({
      data: null,
      status: "error",
      error: "You cannot follow userself.",
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

    User.findOne({ _id: following_id }, (err, followingUser) => {
      if (err || !followingUser) {
        return res.json({
          data: null,
          status: "error",
          error: "Unable to find following user in database.",
        });
      }

      BlockList.findOne(
        { userId: userId, blockUserId: following_id },
        (err, blockUser) => {
          console.log("err: ", err);
          console.log("blockUser: ", blockUser);
          if (blockUser !== null) {
            return res.json({
              data: null,
              status: "error",
              error: "You have blocked this user.",
            });
          }

          BlockList.findOne({ userId: following_id, blockUserId: userId },(err, blockuserid) => {
              if (blockuserid !== null) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "This user has blocked you.",
                });
              }

              const newFollowing = new UserFollowing(req.body);
              const newFollower = new UserFollowers({
                userId: following_id,
                follower_id: userId,
              });
              UserFollowing.findOne(
                { userId: userId, following_id: following_id },
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
                      error: "Already Followed this user.",
                    });
                  }

                  newFollowing.save((err, user) => {
                    if (err) {
                      return res.json({
                        data: null,
                        status: "error",
                        error: "Facing error while following user.",
                      });
                    }
                    if (followingUser) {
                      newFollower.save((err, user) => {
                        if (err) {
                          return res.json({
                            data: null,
                            status: "error",
                            error: "Facing error while following user.",
                          });
                        }
                        return res.json({
                          data: `you followed ${followingUser.username}.`,
                          status: "success",
                          error: null,
                        });
                      });
                    }
                  });
                }
              );
            }
          );
        }
      );
    });
  });
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

  const newBlockUser = new BlockList({
    userId: userId,
    blockUserId: blockUserId,
  });
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
  const unFollowUserId = req.params.unFollowUserId;

  let isUnfollowSuccess = 0;

  if (!unFollowUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is required.",
    });
  }

  if (!Helper.isMongoId(unFollowUserId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is not valid.",
    });
  }

  if (userId === unFollowUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "You cannot unfollow yourself.",
    });
  }

  User.findOne({ _id: unFollowUserId }, (err, user) => {
    if (err || !user) {
      return res.json({
        data: null,
        status: "error",
        error: "User not found.",
      });
    }

    const followingQuery = { userId: userId, following_id: unFollowUserId };

    UserFollowing.findOne(followingQuery, (err, following_user) => {
      if (err || !following_user) {
        return res.json({
          data: null,
          status: "error",
          error: "You are not following this user.",
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

        const followerQuery = { userId: unFollowUserId, follower_id: userId };

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
