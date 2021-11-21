const UserFollowing = require("../../Models/UserFollowing");
const User = require("../../Models/User");
var ObjectID = require("mongodb").ObjectID;

exports.userFollowing = (req, res) => {
  userId = req.body.userId;
  following_id = req.body.following_id;

  if (!following_id || "") {
    return res.json({
      data: null,
      status: "error",
      error: "Following userId is not provided.",
    });
  }

  if (!userId || "") {
    return res.json({
      data: null,
      status: "error",
      error: "Userid is required.",
    });
  }

  if (!ObjectID.isValid(userId)) {
    return res.json({
      data: null,
      status: "error",
      error: "UserId is invalid.",
    });
  }

  if (!ObjectID.isValid(following_id)) {
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

  const newFollowing = new UserFollowing(req.body);
  UserFollowing.findOne({userId: userId, following_id: following_id}, (err, userData) => {
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

    User.findOne({ _id: userId }, (err, user) => {
      if (err || !user) {
        return res.json({
          data: null,
          status: "error",
          error: "User not found in database.",
        });
      }

      User.findOne({ _id: following_id }, (err, followingUser) => {
        if (err) {
          return res.json({
            data: null,
            status: "error",
            error: "Unable to find following user.",
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
          return res.json({
            data: `you followed ${followingUser.username}.`,
            status: "success",
            error: null,
          });
        });
      });
    });
  });
};
