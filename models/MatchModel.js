const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    users: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        validate: {
            validator: function (v) {
                return v.length === 2;
            },
            message: "Un match doit concerner exactement 2 utilisateurs.",
        },
    },
    matchedAt: {
        type: Date,
        default: Date.now,
    },
});

matchSchema.index({ users: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);