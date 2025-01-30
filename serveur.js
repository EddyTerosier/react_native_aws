const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const PORT_WS = process.env.PORT_WS;

mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const wss = new WebSocket.Server({ port: PORT_WS });
const users = [];

// function broadcastUsers() {
//     const userList = users.map(user => ({ id: user.id, name: user.id }));
//     users.forEach(user => {
//         user.ws.send(JSON.stringify({ type: 'users', users: userList }));
//     });
// }

wss.on('connection', (ws) => {
    console.log('Nouvel utilisateur connecté');

    const userId = users.length + 1;
    users.push({ id: userId, ws: ws });
    ws.send(JSON.stringify({ type: 'info', message: `Votre ID utilisateur est ${userId}` }));

    ws.on('message', function incoming(data) {
        const { type, message } = JSON.parse(data);
        if (message) {
            console.log(`Message reçu => ${message}`);
        }
        ws.send(JSON.stringify({ type: 'confirmation', message: 'Message reçu !' }));

        // if (data.type === "getUsers") {
        //     ws.send(JSON.stringify({ type: 'users', users: users }));
        // } else if (data.type === "message" && data.to) {
        //     const recipient = users.find(user => user.id === data.to);
        //     if (recipient) {
        //         recipient.ws.send(JSON.stringify({ type: 'message', message: data.message }));
        //     } else {
        //         ws.send(JSON.stringify({ type: 'error', message: 'Utilisateur non trouvé' }));
        //     }
        // }
    });

    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');