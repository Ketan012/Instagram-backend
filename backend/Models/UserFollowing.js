var mongoose = require('mongoose');

var userFollowingSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    following_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true }
);


module.exports = mongoose.model("UserFollowing", userFollowingSchema);