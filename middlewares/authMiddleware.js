const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

async function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ error: "No token" });

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("_id email");
        if (!user) {
            return res.status(401).json({ error: "Invalid token user" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token or user" });
    }
}

module.exports = authMiddleware;