// Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Définition d'un schéma mongoose pour structurer les documents de la collection "Users"
const usersSchema = new mongoose.Schema({
  // Champ "username" pour stocker le nom d'utilisateur
  username: {
    type: String, // Type de données : chaîne de caractères
    required: true, // Le champ est obligatoire
    unique: true, // Chaque nom d'utilisateur doit être unique dans la base de données
  },
  
  // Champ "password" pour stocker le mot de passe de l'utilisateur
  password: {
    type: String, // Type de données : chaîne de caractères
    required: true, // Le champ est obligatoire
  },
});

// Exportation du modèle mongoose basé sur le schéma défini
// "Users" est le nom du modèle, et le schéma associé est passé en argument
module.exports = mongoose.model("Users", usersSchema);
