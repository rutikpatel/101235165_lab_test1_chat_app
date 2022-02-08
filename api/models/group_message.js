const mongoose = require('mongoose')

const GroupMessage = new mongoose.Schema({
    fromUser: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true,
    },
    room: {
        type: String,
        required: [true, "Please enter room name"],
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
const Group = mongoose.model("Group", GroupMessage);
module.exports = Group;