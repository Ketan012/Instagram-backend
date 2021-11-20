const User = require('./../../Models/User');
const UserFollowers = require('./../../Models/UserFollowers');
const UserFollowing = require('./../../Models/UserFollowing');
var ObjectID = require("mongodb").ObjectID;

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
        if(err){
            return res.json({
                data: null,
                status: 'error',
                error: 'No user found in database.'
            });
        }
        req.profile = user;
        next();
    })
}

exports.getUserData = (req, res) => {
    return res.json({
        data: req.profile,
        status: 'success',
        error: null
    })
}

exports.getAllUser = (req, res) => {
    User.find().exec((err, users)=>{
        if(err){
            return res.json({
                data: null,
                status: 'error',
                error: 'No user found.'
            })
        }
        return res.json({
            data: users,
            status: 'success',
            error: null
        })
    })
}

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
    
      if (!ObjectID.isValid(userId)) {
        return res.json({
          data: null,
          status: "error",
          error: "UserId is invalid.",
        });
      }
    
      if (!ObjectID.isValid(follower_id)) {
        return res.json({
          data: null,
          status: "error",
          error: "Follower userid is invalid.",
        });
      }
    
      if(userId === follower_id){
        return res.json({
          data: null,
          status: "error",
          error: "You cannot follow userself.",
        })
      }

      const newFollower = new UserFollowers(req.body);
      UserFollowers.findOne({userId: userId, follower_id: follower_id}, (err, userData) => {
          if(err){
              return res.json({
                  data: null,
                  status: "error",
                  error: "Not able to find a user."
              })
          }

          if(userData){
              return res.json({
                  data: null,
                  status: "error",
                  error: "this user is already following you."
              })
          }

          User.findOne({_id: userId}, (err, user) => {
            if(err || !user){
                return res.json({
                    data: null,
                    status: "error",
                    error: "User not found in database."
                })
            }

              User.findOne({_id: follower_id}, (err, userfollower) => {

                  if(err || !userfollower){
                      return res.json({
                          data: null,
                          status: "error",
                          error: "Follower user not found in database."
                      })
                  }
                  newFollower.save((err, user) => {
                    if(err){
                        return res.json({
                            data: null,
                            status: "error",
                            error: "facing problem."
                        })
                    }

                return res.json({
                    data: `${follower_id} is following you.`,
                    status: "success",
                    error: null
                })
              })
            })
        })
    })
}

exports.getFollowings = (req, res) => {
    const { userId } = req.body;

    if(!userId){
        return res.json({
            data: null,
            status: "error",
            error: "UserId is required."
        })
    }

    if(!ObjectID.isValid(userId)){
        return res.json({
            data: null,
            status: "error",
            error: "UserId is invalid."
        })
    }

    UserFollowing.find({ userId: userId}, (err, followings)=>{
        if(err){
            return res.json({
                data: null,
                status: "error",
                error: "there is error while fetching user followings."
            })
        }

        if(followings){
            return res.json({
                data: {
                    data: followings,
                    count: followings.length
                },
                status: "success",
                error: null
            })
        }
    })
}

exports.getFollowers = (req, res) => {
    const { userId } = req.body;

    if(!userId){
        return res.json({
            data: null,
            status: "error",
            error: "UserId is required."
        })
    }

    if(!ObjectID.isValid(userId)){
        return res.json({
            data: null,
            status: "error",
            error: "UserId is invalid."
        })
    }

    UserFollowers.find({ userId: userId }, (err, followers)=>{
        if(err){
            return res.json({
                data: null,
                status: "error",
                error: "there is error while fetching user followers."
            })
        }

        if(followers){
            return res.json({
                data: {
                    data: followers,
                    count: followers.length
                },
                status: "success",
                error: null
            })
        }
    })
}