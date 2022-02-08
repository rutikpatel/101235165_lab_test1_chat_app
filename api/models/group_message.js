const mongoose = require('mongoose')

const GroupMessage = new mongoose.Schema({
    from_user: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true,
    },
    to_user: {
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
    date_sent: {
        type: Date,
        default: Date.now,
    }

})
const Group = mongoose.model("Group", GroupMessage);
module.exports = Group;