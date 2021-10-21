var mongoose = require('mongoose');
const crypto = require("crypto");
// const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true,
        unique: true,
    },
    displayname: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    encrypted_password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        maxLength: 10,
    },
    bio: {
        type: String,
        maxLength: 150,
    },
    isPrivate: {
        type: Boolean,
        required: true,
    },
    isActive: {
        type: Boolean
    },
    salt: String
}, { timestamps: true }
);


userSchema
    .virtual('password')
    .set(function(password){
        let count = 1;
        this._password = password;
        this.salt = count;
        this.encrypted_password = this.securePassword(password);
        count ++;
    })
    .get(function() { this._password});

userSchema.methods = {
    authenticate: () => {
        return this.securePassword(plainpassword) === this.encrypted_password;
    },
    securePassword: function (plainpassword) {
        if (!plainpassword) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainpassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};


module.exports = mongoose.model("User", userSchema);