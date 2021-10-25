const User = require('./../../Models/User');

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