const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true,
    },
    firstName:{
        type:String,
        required: [true, "Please enter firstname"],
        trim:true,
        lowercase:true
    },
    lastName: {
        type: String,
        required: [true, "Please enter lastname"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        trim: true,
        lowercase: true
    },
    created: {
        type: Date,
        default: Date.now,
        alias: 'createdon'
    }
})
const User = mongoose.model("User", UserSchema);
module.exports = User;