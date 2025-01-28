const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.password) {
            return res.status(400).send({ error: "Password is required" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            ...req.body,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
        });

        await user.save();

        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = { registerUser };