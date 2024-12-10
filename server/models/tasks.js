// Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Définition d'un schéma mongoose pour structurer les documents de la collection "Tasks"
const tasksSchema = new mongoose.Schema({
  // Champ "title" pour stocker le titre de la tâche
  title: {
    type: String, // Type de données : chaîne de caractères
    required: true, // Le champ est obligatoire
  },
  // Champ "description" pour une description facultative de la tâche
  description: String, // Type de données : chaîne de caractères (non obligatoire)
  
  // Champ "status" pour indiquer si la tâche est terminée ou non
  status: {
    type: Boolean, // Type de données : booléen
    default: false, // Valeur par défaut : non terminée (false)
  },
  
  // Champ "deadline" pour stocker une date limite optionnelle
  deadline: {
    type: Date, // Type de données : date
  },
  
  // Champ "created_on" pour enregistrer la date de création de la tâche
  created_on: {
    type: Date, // Type de données : date
    default: Date.now, // Valeur par défaut : date et heure actuelles
  },
  
  // Champ "created_by" pour identifier l'utilisateur qui a créé la tâche
  created_by: {
    type: String, // Type de données : chaîne de caractères
    required: true, // Le champ est obligatoire
  },
});

// Exportation du modèle mongoose basé sur le schéma défini
// "Tasks" est le nom du modèle, et le schéma associé est passé en argument
module.exports = mongoose.model("Tasks", tasksSchema);
