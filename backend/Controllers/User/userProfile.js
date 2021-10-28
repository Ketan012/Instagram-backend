const fs = require('fs');
const path = require('path')
const UserProfile = require('../../Models/UserProfile');


exports.updateUserProfile = (req, res, next) => {
    const obj = {
        userId: req.params.id,
        profile: {
            buffer: 'data:image/jpeg;base64,' + req.file.buffer.toString('base64'),
            contentType: 'image/JPG'
        },
    }

    UserProfile.create(obj, (err, image)=>{
        if(err){
            return res.json({
                data: null,
                status: 'error',
                error: 'There is error while saving the profile'
            })
        }
        return res.json({
            data: image,
            status: 'success',
            error: null
        })
    })
}

exports.getUserProfile = (req, res) => {
    UserProfile.find((err, item) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            return res.json({
                data: item,
                status: 'success',
                error: null
            })
        }
    })
}

exports.deleteUserProfile = (req, res) => {
    UserProfile.deleteOne({ _id: req.params.id }, (err, item)=>{
        if (err) {
            return res.json({
                data: null,
                status: 'error',
                error: 'cannot delete user'
            })
        }
        else {
            return res.json({
                data: 'user deleted successfullly',
                status: 'success',
                error: null
            })
        }
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