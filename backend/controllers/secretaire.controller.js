const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Secretaire = require("../models/secretaire.model");
require("dotenv").config();

// Vérifier si JWT_SECRET est défini
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET est manquant dans les variables d'environnement");
}

/**
 * Créer un compte secrétaire
 */
exports.createSecretaire = async (req, res) => {
  try {
    let { nom, prenom, email, motDePasse } = req.body;

    // Vérifier si tous les champs sont bien présents
    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Appliquer .trim() uniquement si les valeurs existent
    email = email.trim();
    motDePasse = motDePasse.trim();

    // Vérifier le format de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    // Vérifier la force du mot de passe (au moins 8 caractères, 1 majuscule, 1 chiffre)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(motDePasse)) {
      return res.status(400).json({ message: "Mot de passe trop faible. Il doit contenir au moins 8 caractères, une majuscule et un chiffre" });
    }

    // Vérifier si l'email est déjà utilisé
    const existingSecretaire = await Secretaire.findOne({ email });
    if (existingSecretaire) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 12);
    const newSecretaire = new Secretaire({ nom, prenom, email, motDePasse: hashedPassword });
    await newSecretaire.save();

    res.status(201).json({ message: "Secrétaire créé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la création du secrétaire:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Connexion d'un secrétaire
 */
exports.login = async (req, res) => {
  try {
    let { email, motDePasse } = req.body;

    // Vérifier si les champs sont fournis
    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe sont obligatoires" });
    }

    email = email.trim();
    motDePasse = motDePasse.trim();

    // Vérifier si l'utilisateur existe
    const secretaire = await Secretaire.findOne({ email });
    if (!secretaire) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparer les mots de passe
    const isMatch = await bcrypt.compare(motDePasse, secretaire.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Créer le token JWT
    const token = jwt.sign({ id: secretaire._id, email: secretaire.email }, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Répondre avec le token
    res.status(200).json({ message: "Connexion réussie", token });

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Supprimer un compte secrétaire
 */
exports.deleteSecretaire = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification de l'ID valide
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // Recherche du secrétaire à supprimer
    const deletedSecretaire = await Secretaire.findByIdAndDelete(id);
    if (!deletedSecretaire) {
      return res.status(404).json({ message: "Secrétaire non trouvé" });
    }

    res.status(200).json({ message: "Secrétaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du secrétaire:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
