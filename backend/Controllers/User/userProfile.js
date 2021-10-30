const UserProfile = require('../../Models/UserProfile');


exports.updateUserProfile = (req, res, next) => {
    const obj = {
        userId: req.params.id,
        profile: {
            buffer: 'data:image/jpeg;base64,' + req.file.buffer.toString('base64'),
            contentType: req.file.mimetype
        },
    }

    UserProfile.findOne({ userId :req.params.id }).exec((err, user)=>{
        if(user){
            const filter = { 'userId' : req.params.id};
            const options = { 'profile' : obj.profile};
            UserProfile.findOneAndUpdate(filter, options, (err, userProfile)=>{
                if(err){
                    return res.json({
                        data: null,
                        status: 'error',
                        error: 'Cannot update User profile. Please try again'
                    })
                }

                    return res.json({
                        data: 'Profile photo updated successfully.',
                        status: 'success',
                        error: null
                    })
            })
        }
        else{
            UserProfile.create(obj, (err, image)=>{
                if(err){
                    return res.json({
                        data: null,
                        status: 'error',
                        error: 'There is error while saving the profile'
                    })
                }
                return res.json({
                    data: 'Profile Update Uploaded Successfully',
                    status: 'success',
                    error: null
                })
            })
        }
    })

}

exports.getUserProfile = (req, res) => {
    UserProfile.findOne({userId: req.params.id}).exec((err, user) => {
        if (err || !user) {
            return res.json({
                data: null,
                status: 'error',
                error: 'No user profile found.'
            })
        }
        else {
            return res.json({
                data: user,
                status: 'success',
                error: null
            })
        }
    })
}

exports.deleteUserProfile = (req, res) => {
    UserProfile.deleteOne({ userId: req.params.id }, (err, item)=>{
        if (err) {
            return res.json({
                data: null,
                status: 'error',
                error: 'cannot delete user'
            })
        }
            return res.json({
                data: 'user deleted successfullly',
                status: 'success',
                error: null
            })
    })
}

exports.deleteAll = (req, res) => {
    UserProfile.deleteMany((err, user)=>{
        if (err) {
            return res.json({
                data: null,
                status: 'error',
                error: 'cannot delete user'
            })
        }
        else {
            return res.json({
                data: 'users deleted successfullly',
                status: 'success',
                error: null
            })
        }
    })
}