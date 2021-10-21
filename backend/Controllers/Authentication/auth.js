const User = require('./../../Models/User');
const { validationResult } = require('express-validator');

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { username, email, displayname } = req.body;

    User.findOne({ username }, (err, user) => {
        if (user) {
            return res.status(400).json({
                data: null,
                status: 'error',
                error: 'username is already exists!'
            })
        }

        User.findOne({ displayname }, (err, user) => {
            if (user) {
                return res.status(400).json({
                    data: null,
                    status: 'error',
                    error: 'displayname is already exists!'
                })
            }
            User.findOne({ email }, (err, user) => {
                if (user) {
                    return res.status(400).json({
                        data: null,
                        status: 'error',
                        error: 'email is already exists!'
                    })
                }

                const newUser = new User(req.body);
                newUser.save((err, user) => {
                    if (err) {
                        return res.status(400).json({
                            data: null,
                            status: 'error',
                            error: err
                        })
                    }
                    return res.json({
                        data: {
                            username: user.username,
                            email: user.email
                        },
                        status: 'success',
                        error: null
                    })
                })

            });

        })


    });




}

exports.login = (req, res) => {
    res.json({
        message: 'login route!'
    })
}

exports.verificationCode = (req, res) => {
    res.json({
        message: 'verificationCode route!'
    })
}

exports.verifyEmail = (req, res) => {
    res.json({
        message: 'verifyEmail route!'
    })
}

exports.resetPasswordLink = (req, res) => {
    res.json({
        message: 'resetPasswordLink route!'
    })
}
