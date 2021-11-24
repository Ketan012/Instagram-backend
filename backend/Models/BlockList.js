var mongoose = require('mongoose');

var blockListSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blockUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true }
);


module.exports = mongoose.model("BlockList", blockListSchema);