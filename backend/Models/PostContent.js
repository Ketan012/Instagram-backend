var mongoose = require('mongoose');

var postContentSchema = new mongoose.Schema({
    content : {
        buffer : {
            type    : String,
            required: true
        },
        contentType : {
            type    : String,
            required: true
        }
    },
    postType : {
        type : String,
    },
    caption : {
        type: String
    },
    location : {
        type: String
    },
}, { timestamps : true}
);

module.exports = new mongoose.model("PostContent", postContentSchema);