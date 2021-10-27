var mongoose = require('mongoose');

var userProfileSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profile: {
        data: Buffer,
        contentType: String
    },
    path: String
}, { timestamps: true }
);


module.exports = mongoose.model("UserProfile", userProfileSchema);