const User = require('./../../Models/User');
const UserFollowers = require('./../../Models/UserFollowers');
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
      UserFollowers.findOne(req.body, (err, userData) => {
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
                  error: "this user already following you."
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
    return ;
}