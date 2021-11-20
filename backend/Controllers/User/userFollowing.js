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

  if(userId === following_id){
    return res.json({
      data: null,
      status: "error",
      error: "You cannot follow userself.",
    })
  }

  const newFollowing = new UserFollowing(req.body);
  UserFollowing.findOne(req.body, (err, userData) => {
    if (err) {
      return res.json({
        data: null,
        status: "error",
        error: "Not able to find user.",
      });
    }
    if (userData) {
      return res.json({
        data: "Already Followed this user.",
        status: "success",
        error: null,
      });
    }
    newFollowing.save((err, user) => {
      if (err) {
        return res.json({
          data: null,
          status: "error",
          error: "Faceing error while following user.",
        });
      }

      User.findOne({ _id: following_id }, (err, followingUser) => {
        if (err) {
          return res.json({
            data: null,
            status: "error",
            error: "Unable to find user.",
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
};
