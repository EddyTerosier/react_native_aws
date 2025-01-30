const express = require("express");
const router = express.Router();

const {registerUser, loginUser} = require ("./controllers/userController");
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("./controllers/forumController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/posts", createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

module.exports = router;