const express = require("express");
const router = express.Router();
const SecretaireController = require("../controllers/secretaire.controller");
const authenticate = require("../middlewares/authenticate"); // Middleware d'authentification

/**
 * @route POST /secretaire
 * @desc Enregistre une nouvelle secrétaire (accessible sans authentification)
 */
router.post("/", (req, res) => {
    console.log("🔍 Requête reçue pour ajouter un secrétaire :", req.body);
    SecretaireController.createSecretaire(req, res);
});

/**
 * @route POST /secretaire/login
 * @desc Connexion d'une secrétaire (accessible sans authentification)
 */
router.post("/login", (req, res) => {
    console.log("🔍 Requête reçue pour la connexion :", req.body);
    SecretaireController.login(req, res);
});

/**
 * @route GET /secretaire
 * @desc Récupère la liste des secrétaires (🔐 protégée)
 */
router.get("/", authenticate, (req, res) => {
    console.log("🔍 Requête reçue pour obtenir la liste des secrétaires.");
    SecretaireController.getSecretaires(req, res);
});

/**
 * @route PUT /secretaire/edit/:id
 * @desc Modifie une secrétaire (🔐 protégée)
 */
router.put("/edit/:id", authenticate, (req, res) => {
    console.log(`🔍 Requête reçue pour modifier une secrétaire (ID: ${req.params.id})`, req.body);
    SecretaireController.editSecretaire(req, res);
});

/**
 * @route PUT /secretaire/change-password
 * @desc Change le mot de passe d'une secrétaire (🔐 protégée)
 */
router.put("/change-password", authenticate, (req, res) => {
    console.log("🔍 Requête reçue pour changer le mot de passe.");
    SecretaireController.changePassword(req, res);
});

/**
 * @route DELETE /secretaire/:id
 * @desc Supprime une secrétaire (🔐 protégée)
 */
router.delete("/:id", authenticate, (req, res) => {
    console.log(`🔍 Requête reçue pour supprimer une secrétaire (ID: ${req.params.id})`);
    SecretaireController.deleteSecretaire(req, res);
});

module.exports = router;
