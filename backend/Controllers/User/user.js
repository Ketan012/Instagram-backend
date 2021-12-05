const User = require("./../../Models/User");
const UserFollowers = require("./../../Models/UserFollowers");
const UserFollowing = require("./../../Models/UserFollowing");
const BlockList = require("./../../Models/BlockList");
const Helper = require("../../Utils/Helper");

exports.getUserById = (req, res, next, id) => {

  if(!Helper.isMongoId(id)){
    return res.json({
      data: null,
      status: "error",
      error: "Id is invalid.",
    });
  }
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

            UserFollowers.deleteOne({ follower_id: blockUserId, userId: userId }, (err) => {
              if (err) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "Unable to find Block user.",
                });
              }
            });

            UserFollowing.deleteOne({ following_id: blockUserId, userId: userId }, (err) => {
              if (err) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "Unable to find Block user.",
                });
              }
            });

            UserFollowers.deleteOne({ follower_id: userId, userId: blockUserId }, (err) => {
              if (err) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "Unable to find Block user.",
                });
              }
            });

            UserFollowing.deleteOne({ following_id: userId, userId: blockUserId }, (err) => {
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

exports.unblockUser = (req, res) => {
  userId = req.profile._id;
  unblockUserId = req.params.unblockUserId;

  if (!unblockUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "Unblock user id is required.",
    });
  }

  if (!Helper.isMongoId(unblockUserId)) {
    return res.json({
      data: null,
      status: "error",
      error: "Unblock user id is invalid.",
    });
  }

  if (userId === unblockUserId) {
    return res.json({
      data: null,
      status: "error",
      error: "You cannot unblock yourself.",
    });
  }

  BlockList.findOne(
    { userId: userId, blockUserId: unblockUserId },
    (err, unblockUser) => {
      if (err || !unblockUser) {
        return res.json({
          data: null,
          status: "error",
          error: "You have already unblocked this user.",
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

        User.findOne({ _id: unblockUserId }, (err, unblockUser) => {
          if (err) {
            return res.json({
              data: null,
              status: "error",
              error: "Unable to find unblock user.",
            });
          }

          BlockList.deleteOne(
            { blockUserId: unblockUserId, userId: userId },
            (err, unblockUser) => {
              if (err || !unblockUser) {
                return res.json({
                  data: null,
                  status: "error",
                  error: "Unable to find unblock user.",
                });
              }
            }
          );

          return res.json({
            data: `You have successfully unblocked this user.`,
            status: "success",
            error: null,
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

exports.removeFollower = (req, res) => {
  const { _id: userId } = req.profile;
  const followerId = req.params.followerId;

  if(!followerId || followerId === ""){
    return res.json({
      data: null,
      status: "error",
      error: "Follower id is required."
    })
  }

  if(!Helper.isMongoId(followerId)){
    return res.json({
      data: null,
      status: "error",
      error: "Follower id is invalid."
    })
  }

  if(userId == followerId){
    return res.json({
      data: null,
      status: "error",
      error: "You cannot remove yourself."
    })
  }

  User.findOne({ _id: followerId }, (err, user) => {
    if(err || !user){
      return res.json({
        data: null,
        status: "error",
        error: "Follower id is not found."
      })
    }

    const query = { userId: userId, follower_id: followerId};
    UserFollowers.findOne(query, (err, userFollower) => {
      if(err || !userFollower){
        return res.json({
          data: null,
          status: "error",
          error: "This user is not following you."
        })
      }

      if(userFollower){
        UserFollowers.deleteOne(query, (err, removefollower) => {
          if(err){
            return res.json({
              data: null,
              status: "error",
              error: "Facing error while removing the follower."
            })
          }
          if(removefollower){
            UserFollowing.deleteOne({userId: followerId, following_id: userId}, (err, removefollowing) => {
              if(err){
                return res.json({
                  data: null,
                  status: "error",
                  error: "Facing error while removing the follower."
                })
              } 
              
              if(removefollowing){
                  return res.json({
                    data: "You have remove this user from your followers list.",
                    status: "success",
                    error: null
                  })
                }
            })
          }
        })
      }
    })
  });
}

exports.updateUserData = (req, res) => {
  const { _id: userId } = req.profile;
  const { username, displayname, email } = req.body;

  User.findOne({ _id: userId }, (err, user) => {
    if(err || !user){
      return res.json({
        data: null,
        status: "error",
        error: "User not found."
      })
    }

    if(!username || username === ""){
      return res.json({
        data: null,
        status: "error",
        error: "Username is required."
      })
    }

    if(!displayname || displayname === ""){
      return res.json({
        data: null,
        status: "error",
        error: "Display name is required."
      })
    }

    if(!email || email === ""){
      return res.json({
        data: null,
        status: "error",
        error: "Email is required."
      })
    }

    if(!Helper.isValidEmail(email)){
      return res.json({
        data: null,
        status: "error",
        error: "Email is invalid."
      })
    }

    if(username.length < 3){
      return res.json({
        data: null,
        status: "error",
        error: "Username should be at least 3 characters long."
      })
    }

    if(username.length > 15){
      return res.json({
        data: null,
        status: "error",
        error: "Username should at most 15 characters long."
      })
    }

    if(displayname.length < 3){
      return res.json({
        data: null,
        status: "error",
        error: "Display name should be at least 3 characters long."
      })
    }

    if(displayname.length > 15){
      return res.json({
        data: null,
        status: "error",
        error: "Display name should be at most 15 characters long."
      })
    }

    User.findOneAndUpdate({ _id: userId }, { 
      username: username,
      displayname: displayname,
      email: email
     }, (err, updatedUser) => {
      if (err) {
        return res.json({
          data: null,
          status: "error",
          error: "Cannot update the user data.",
        });
      }
  
      return res.json({
        data: "User data updated successfully.",
        status: "success",
        error: null,
      });
    });
  })
}

exports.searchUser = (req, res) => {
  const searchString = req.query.searchstring;
  
  if(searchString === ""){
    return res.json({
      data: null,
      status: "error",
      error: "Search string is required."
    })
  }

  User.find({
    $or: [
      {
        username: { $regex: `^${searchString}`, $options: "i" },
      },
      {
        displayname: { $regex: `^${searchString}`, $options: "i" },
      },
    ],
  }, (err, users) => {

    if(err){
      return res.json({
        data: null,
        status: "error",
        error: "Facing error while fetching the users."
      })
    }

    return res.json({
      data: users,
      status: "success",
      error: null
    })
  });
}
