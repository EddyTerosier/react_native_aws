const express = require("express");
const router = express.Router();

const { registerUser, loginUser, fetchAllUsers } = require("./controllers/userController");
const { getMessagesByUser, getMessagesBetweenUsers } = require("./controllers/MessageController");
const { swipe } = require("./controllers/swipeController");
const { getMatches } = require("./controllers/matchesController");
const authMiddleware = require("./middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/users", fetchAllUsers);

router.get("/messages/:userId", getMessagesByUser);
router.get("/messages/:senderId/:receiverId", getMessagesBetweenUsers);

router.post("/swipe", swipe);

router.get("/matches", authMiddleware, getMatches);

router.get("/me", authMiddleware, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    res.json({
        _id: req.user._id,
        email: req.user.email,
    });
});


module.exports = router;