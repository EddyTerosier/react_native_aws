const Post = require("../models/PostModel");

const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = new Post({ title, description });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }
        res.status(200).send({ message: "Post deleted" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };