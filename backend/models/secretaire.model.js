const mongoose = require("mongoose");

// Définition du schéma pour le modèle Secretaire
const secretaireSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true, // Le nom est obligatoire
      trim: true, // Supprime les espaces inutiles au début et à la fin
    },
    prenom: {
      type: String,
      required: true, // Le prénom est obligatoire
      trim: true,
    },
    email: {
      type: String,
      required: true, // L'email est obligatoire
      unique: true, // L'email doit être unique
      trim: true,
      lowercase: true, // Convertir en minuscules pour éviter les doublons
      match: [/^\S+@\S+\.\S+$/, "Veuillez entrer un email valide"], // Validation de l'email
    },
    motDePasse: {
      type: String,
      required: true, // Le mot de passe est obligatoire
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"], // Validation de longueur
    },
    role: {
      type: String,
      enum: ["admin", "secretaire"], // Rôle limité à "admin" ou "secretaire"
      default: "secretaire", // Par défaut, le rôle est "secretaire"
    },
    etat: {
      type: String,
      enum: ["libre", "occupée"], // L'état peut être "libre" ou "occupée"
      default: "libre",
    },
    horaires: {
      ouverture: {
        type: String,
        default: "08:00", // Heure d'ouverture par défaut
        match: [/^([01]?\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:mm)"], // Validation du format
      },
      fermeture: {
        type: String,
        default: "18:00", // Heure de fermeture par défaut
        match: [/^([01]?\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:mm)"], // Validation du format
      },
    },
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

// Création du modèle basé sur le schéma
const Secretaire = mongoose.model("Secretaire", secretaireSchema);

// Exportation du modèle pour l'utiliser ailleurs dans l'application
module.exports = Secretaire;
