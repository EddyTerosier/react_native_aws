const Match = require("../models/MatchModel");

const getMatches = async (req, res) => {
    try {
        const userId = req.user._id;
        const matches = await Match.find({ users: userId }).populate("users", "email");
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMatches };