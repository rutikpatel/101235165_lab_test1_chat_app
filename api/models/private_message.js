const mongoose = require('mongoose')

const PrivateMsg = new mongoose.Schema({
    fromUser: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true,
    },
    toUser: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    dateSent: {
        type: Date,
        default: Date.now,
    }

})
const Private = mongoose.model("PrivateMsg", PrivateMsg);
module.exports = Private;