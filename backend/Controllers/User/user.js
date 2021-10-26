const User = require('./../../Models/User');

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