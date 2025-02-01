require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const User = require("./models/UserModel");
const Message = require("./models/MessageModel");
const Match = require("./models/MatchModel");

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
        // origin: "http://localhost:5173",
        // origin: "http://localhost:8081",
        methods: ["GET", "POST"],
    },
});

const emitUsers = async () => {
    const users = await User.find({}, "email");
    io.emit("usersList", users);
};

io.on("connection", (socket) => {
    console.log(`⚡ Utilisateur connecté: ${socket.id}`);

    socket.on('registerUser', async (email) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                socket.emit('errorMessage', 'Utilisateur non trouvé');
                return;
            }

            user.socketId = socket.id;
            await user.save();

            socket.emit('userRegistered', { userId: user._id, email: user.email });
            console.log(`✅ Utilisateur mis à jour (socketId) : ${email}`);

            const messages = await Message.find({
                $or: [{ sender: user._id }, { receiver: user._id }]
            }).populate('sender receiver', 'email');

            socket.emit('previousMessages', messages);

            emitUsers();
        } catch (err) {
            console.error('❌ Erreur lors du registerUser via socket:', err);
        }
    });

    socket.on("sendMessage", async ({ sender, receiver, text }) => {
        try {
            const usersSorted = [sender, receiver].sort();
            const match = await Match.findOne({ users: usersSorted });
            if (!match) {
                return socket.emit("errorMessage", "Vous ne pouvez pas envoyer de message à cet utilisateur car vous n'avez pas matché.");
            }

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