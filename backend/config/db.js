const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Charger les variables d'environnement

// Fonction de connexion à la base de données
const connectDB = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {

      useNewUrlParser: true,
      useUnifiedTopology: true,

    });

    console.log("Connexion à MongoDB réussie");
  } catch (err) {
    console.error("Erreur de connexion à MongoDB:", err.message);
    process.exit(1); // Arrêter le processus si la connexion échoue
  }
};

module.exports = connectDB;