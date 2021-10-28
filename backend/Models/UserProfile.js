var mongoose = require('mongoose');

var userProfileSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profile: {
        buffer: String,
        contentType: String
    },
}, { timestamps: true }
);


module.exports = mongoose.model("UserProfile", userProfileSchema);