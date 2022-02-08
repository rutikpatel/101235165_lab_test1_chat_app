const mongoose = require('mongoose')

const PrivateMessage = new mongoose.Schema({
    from_user: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true,
    },
    room: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    date_sent: {
        type: Date,
        default: Date.now,
    }

})

const Private = mongoose.model("Private", PrivateMessage);
module.exports = Private;