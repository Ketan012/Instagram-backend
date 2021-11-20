var mongoose = require('mongoose');
const User = require('./User');

var userFollowerSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    follower_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
}, { timestamps: true }
);


module.exports = mongoose.model("UserFollower", userFollowerSchema);