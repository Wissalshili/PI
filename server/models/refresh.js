// Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Définition d'un nouveau schéma mongoose pour stocker les jetons d'actualisation
const RefreshTokens = new mongoose.Schema({
  // Champ "username" pour stocker le nom d'utilisateur associé au jeton d'actualisation
  username: {
    type: String, // Type de données : chaîne de caractères
    required: true, // Le champ est obligatoire
  },
  // Champ "refreshToken" pour stocker le jeton d'actualisation
  refreshToken: {
    type: String, // Type de données : chaîne de caractères
    required: true, // Le champ est obligatoire
  },
});

// Exportation du modèle mongoose basé sur le schéma défini
// "RefreshTokens" est le nom du modèle, et le schéma associé est passé en argument
module.exports = mongoose.model("RefreshTokens", RefreshTokens);
