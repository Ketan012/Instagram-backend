var mongoose = require('mongoose');

var userPostSchema = new mongoose.Schema({
    postContentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostContent'
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = new mongoose.model('UserPost', userPostSchema);