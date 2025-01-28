const express = require("express"); // Import express
const cors = require("cors"); // Import cors
const { createServer } = require("http");
const { Server } = require("socket.io");
const WebSocket = require('ws');

const app = express(); // Create express app
const httpServer = createServer(app);
const port = 5555; // definir le port d'écoute

const io = new Server(httpServer, {
    cors: {
        origin: "*", // À personnaliser selon vos besoins
        methods: ["GET", "POST"]
    }
});

// Gestion des connexions WebSocket
io.on("connection", (socket) => {
    console.log("Nouveau client connecté :", socket.id);

    // Exemple d'événement personnalisé
    socket.on("message", (data) => {
        console.log("Message reçu :", data);
        socket.emit("messageRecu", "Le message a été reçu avec succès");
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté :", socket.id);
    });
});

app.use(cors()); // Use cors

httpServer.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

books = [
    {
        id: 1,
        title: "Harry Potter and the Sorcerer's stone",
        author: "J.K. Rowling",
        year: 1997,
    },
    {
        id: 2,
        title: "Jurassic Park",
        author: "Michael Crichton",
        year: 1990,
    },
    {
        id: 3,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
    },
];

// GET
// PUT
// POST
// DELETE

app.get("/api/books", (req, res) => {
    console.log("GET /api/books");
    res.json(books);
});

// Créer un serveur WebSocket autonome
const wss = new WebSocket.Server({ 
    port: 8080, // Port dédié aux WebSockets
    host: 'localhost' // Limiter aux connexions locales si nécessaire
});

// Gestion des connexions
wss.on('connection', function connection(ws) {
    console.log('Nouvelle connexion WebSocket établie');

    // Gestion des messages reçus
    ws.on('message', function incoming(message) {
        const messageString = message.toString();
        console.log('Message reçu :', messageString);

        // Exemple de réponse
        ws.send(JSON.stringify({
            status: 'reçu',
            message: messageString
        }));
    });

    // Gestion des erreurs
    ws.on('error', function error(err) {
        console.error('Erreur WebSocket :', err);
    });

    // Gestion de la fermeture de la connexion
    ws.on('close', function close() {
        console.log('Connexion WebSocket fermée');
    });

    // Envoyer un message de bienvenue
    ws.send(JSON.stringify({
        type: 'connexion',
        message: 'Connexion au serveur WebSocket établie'
    }));
});

// Gestion des erreurs du serveur WebSocket
wss.on('error', function serverError(error) {
    console.error('Erreur du serveur WebSocket :', error);
});

console.log('Serveur WebSocket démarré sur ws://localhost:8080');