const User = require("../models/UserModel");
const Match = require("../models/MatchModel");

const swipe = async (req, res) => {
    try {
        const { swiperId, targetId, swipeType } = req.body;

        if (swiperId === targetId) {
            return res.status(400).json({ error: "Vous ne pouvez pas swipper sur vous-même." });
        }

        if (swipeType !== "like") {
            return res.status(200).json({ message: "Swipe enregistré" });
        }

        const swiper = await User.findById(swiperId);
        if (!swiper) {
            return res.status(404).json({ error: "Utilisateur swiper introuvable." });
        }

        const targetUser = await User.findById(targetId);
        if (!targetUser) {
            return res.status(404).json({ error: "Utilisateur ciblé introuvable." });
        }

        if (!swiper.likedUsers.map(id => id.toString()).includes(targetId)) {
            swiper.likedUsers.push(targetId);
            await swiper.save();
        }

        if (targetUser.likedUsers.map(id => id.toString()).includes(swiperId)) {
            const sortedIds = [swiperId, targetId].sort();

            let match = await Match.findOne({ users: sortedIds });
            if (!match) {
                match = await Match.create({ users: sortedIds });
            }

            return res.status(200).json({ message: "Match créé", match });
        }

        return res.status(200).json({ message: "Swipe enregistré" });
    } catch (error) {
        console.error("Erreur dans swipeController:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { swipe };