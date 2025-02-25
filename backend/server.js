// Importation des modules nécessaires
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const secretaireRoutes = require("./routes/secretaire.routes");
const authenticate = require("./middlewares/authenticate"); // Correction de la casse
const SecretaireController = require("./controllers/secretaire.controller");

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialisation de WebSocket avec gestion de CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Remplace par l'URL correcte si nécessaire
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MongoDB avec gestion des erreurs
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connexion à MongoDB réussie");
  } catch (err) {
    console.error("❌ Erreur de connexion à MongoDB:", err);
  }
})();

app.use((req, res, next) => {
  console.log(`➡️ Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Routes API
app.use("/api/secretaires", secretaireRoutes);

// Route test API
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ API en ligne" });
});

// 🔌 Gestion des WebSockets
io.on("connection", (socket) => {
  console.log("🔌 Nouvelle connexion WebSocket :", socket.id);

  // Réception d'une action de la secrétaire
  socket.on("secretaire-action", (msg, ack) => {
    console.log("📩 Action reçue de la secrétaire :", msg);
    io.emit("update-etudiant", msg);

    if (typeof ack === "function") {
      ack({ success: true });
    } else {
      console.warn("⚠️ Aucun callback d'acquittement fourni par le client.");
    }
  });

  // Changement de mot de passe
  socket.on("changer-mot-de-passe", (data) => {
    console.log("🔑 Demande de changement de mot de passe reçue");
    io.emit("confirmation-mot-de-passe", "Mot de passe changé avec succès !");
  });

  // Demande d'un étudiant
  socket.on("demande-etudiant", (demande) => {
    console.log("🎓 Demande d'un étudiant reçue :", demande);
    io.emit("new-entry-request", demande);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    console.log(`❌ Utilisateur ${socket.id} déconnecté !`);
  });
});

// Lancement du serveur
server.listen(PORT, () => {
  console.log(`🚀 Serveur WebSocket et API démarrés sur le port ${PORT}`);
});
