// Importation de la bibliothèque JSON Web Token (JWT) pour la gestion des jetons d'accès
const jwt = require("jsonwebtoken");

// Fonction pour générer un jeton d'accès (access token)
const generateAccessToken = (user) => {
  // Génère un jeton signé avec les données de l'utilisateur et une clé secrète depuis les variables d'environnement
  return jwt.sign(user, process.env.c, {
    expiresIn: "30min", // Le jeton expire au bout de 30 minutes
  });
};

// Middleware pour authentifier le jeton d'accès
function authenticateToken(req, res, next) {
  // Récupération de l'en-tête d'autorisation (Authorization header) de la requête
  const authHeader = req.headers["authorization"]; // Cela ressemble à "Bearer token"

  // Extraction du jeton de l'en-tête d'autorisation
  const token = authHeader && authHeader.split(" ")[1]; // Cela est équivalent à "token"

  // Si aucun jeton n'est trouvé, on renvoie une erreur 401 (non autorisé)
  if (token == null) return res.sendStatus(401); // Si le jeton est absent

  // Vérification de la validité du jeton
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Si le jeton est invalide ou expiré, on renvoie une erreur 403 (accès interdit)
    if (err) return res.sendStatus(403); // Si le jeton n'est pas valide

    // Si le jeton est valide, on attache les informations de l'utilisateur à la requête (req.user)
    req.user = user; // L'utilisateur est désormais disponible dans req.user

    // Passer la main au prochain middleware ou à la route
    next(); 
  });
}

// Exportation de la fonction de génération de jeton et du middleware pour les utiliser dans d'autres fichiers
module.exports = {
  generateAccessToken,
  authenticateToken,
};
