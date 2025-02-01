const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    socketId: {
        type: String,
        default: null,
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
});

module.exports = mongoose.model("User", userSchema);