const express = require("express");
const router = express.Router();

const { registerUser, loginUser, fetchAllUsers } = require("./controllers/userController");
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("./controllers/forumController");
const { getMessagesByUser, getMessagesBetweenUsers } = require("./controllers/MessageController");
const authMiddleware = require("./middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/posts", createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

router.get("/users", fetchAllUsers);

router.get("/messages/:userId", getMessagesByUser);
router.get("/messages/:senderId/:receiverId", getMessagesBetweenUsers);

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
