const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Récupérer le token dans le header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Accès non autorisé, token manquant ou mal formaté" });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1]; // Utilisation de split pour plus de flexibilité

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token validé:", decoded); // Après jwt.verify

    req.user = decoded; // Attache les infos utilisateur à la requête

    next(); // Passer au middleware ou à la route suivante
  } catch (err) {
    // Vérification de type d'erreur
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré, veuillez vous reconnecter" });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Accès non autorisé, token invalide ou mal formé" });
    }

    return res.status(500).json({ message: "Erreur interne du serveur, veuillez réessayer" }); // Erreur générique
  }
};

module.exports = authenticate;
