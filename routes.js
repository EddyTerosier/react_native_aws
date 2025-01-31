const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("./controllers/userController");
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("./controllers/forumController");
const { getMessagesByUser, getMessagesBetweenUsers } = require("./controllers/MessageController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/posts", createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

router.get("/messages/:userId", getMessagesByUser);
router.get("/messages/:senderId/:receiverId", getMessagesBetweenUsers);

module.exports = router;
