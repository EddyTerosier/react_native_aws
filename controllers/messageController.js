const Message = require("../models/MessageModel");

const getMessagesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate("sender receiver", "email");

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const getMessagesBetweenUsers = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).populate("sender receiver", "email");

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = {
    getMessagesByUser,
    getMessagesBetweenUsers
};