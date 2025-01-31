const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const registerUser = async (req, res) => {
    try {
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

const loginUser = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("Utilisateur introuvable");
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send("Mot de passe incorrect");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).send({ message: "Connecté", token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };