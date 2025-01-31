require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const User = require("./models/UserModel");
const Message = require("./models/MessageModel");

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connecté à MongoDB"))
    .catch((err) => {
        console.error("❌ Erreur lors de la connexion à MongoDB:", err);
        process.exit(1);
    });

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// À l'évènement "usersList", on émet la liste des utilisateurs
const emitUsers = async () => {
    const users = await User.find({}, "email");
    io.emit("usersList", users);
};

io.on("connection", (socket) => {
    console.log(`⚡ Utilisateur connecté: ${socket.id}`);

    // Enregistrement de l'utilisateur
    socket.on("registerUser", async (email) => {
        try {
            let user = await User.findOne({ email });

            if (!user) {
                user = new User({
                    email,
                    password: "placeholder",
                    socketId: socket.id
                });
                await user.save();
            } else {
                user.socketId = socket.id;
                await user.save();
            }

            socket.emit("userRegistered", { userId: user._id, email: user.email });
            console.log(`✅ Utilisateur enregistré : ${email}`);

            const messages = await Message.find({
                $or: [{ sender: user._id }, { receiver: user._id }]
            }).populate("sender receiver", "email");

            socket.emit("previousMessages", messages);

            emitUsers();
        } catch (err) {
            console.error("❌ Erreur lors de l’enregistrement utilisateur:", err);
        }
    });

    // Gestion de l'envoi de message
    socket.on("sendMessage", async ({ sender, receiver, text }) => {
        try {
            const senderUser = await User.findById(sender);
            const receiverUser = await User.findById(receiver);

            if (!senderUser || !receiverUser) {
                return socket.emit("errorMessage", "Utilisateur non trouvé");
            }

            const message = new Message({
                sender: senderUser._id,
                receiver: receiverUser._id,
                text
            });
            await message.save();

            const messageData = {
                sender: { _id: senderUser._id, email: senderUser.email },
                receiver: { _id: receiverUser._id, email: receiverUser.email },
                text,
            };

            if (senderUser.socketId) {
                io.to(senderUser.socketId).emit("receiveMessage", messageData);
            }

            if (receiverUser.socketId) {
                io.to(receiverUser.socketId).emit("receiveMessage", messageData);
            }

            console.log(`📩 Message de ${senderUser.email} vers ${receiverUser.email}: ${text}`);
        } catch (err) {
            console.error("❌ Erreur lors de l’envoi du message:", err);
        }
    });

    // Déconnexion
    socket.on("disconnect", async () => {
        try {
            const user = await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
            if (user) {
                console.log(`⚠️ Utilisateur déconnecté: ${user.email}`);
                emitUsers();
            }
        } catch (err) {
            console.error("❌ Erreur lors de la déconnexion utilisateur:", err);
        }
    });
});

app.use("/", routes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});