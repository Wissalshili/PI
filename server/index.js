// Chargement des variables d'environnement depuis un fichier .env en fonction de l'environnement (production ou développement)
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.development", // Si en production, on utilise .env, sinon .env.development
});

// Importation des dépendances nécessaires
const express = require("express"); // Framework pour construire des applications web
const cors = require("cors"); // Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
const mongoose = require("mongoose"); // Bibliothèque pour interagir avec MongoDB

// Création d'une application Express
const app = express();

// Configuration de CORS pour autoriser les requêtes depuis l'URL de l'application frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // On autorise les requêtes depuis l'URL définie dans les variables d'environnement
  })
);

// Middleware pour parser les données envoyées en URL-encoded (par exemple, les formulaires) et en JSON
app.use(express.urlencoded({ extended: true })); // Permet de parser les données url-encoded
app.use(express.json()); // Permet de parser les données au format JSON

// Configuration de Mongoose pour éviter les erreurs de requêtes strictes
mongoose.set("strictQuery", true);

// Connexion à la base de données MongoDB (utilisation d'un URI avec des informations de connexion)
mongoose.connect("mongodb+srv://mohamedjasser:L8xe0h4ZuPBa2yPq@backendnodejs.4fkx6tv.mongodb.net/", {
  useNewUrlParser: true, // Utilisation de la nouvelle URL parser de MongoDB
  useUnifiedTopology: true, // Utilisation de la nouvelle stratégie de gestion des connexions
});

// Gestion des erreurs de connexion à la base de données
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // Si une erreur se produit lors de la connexion, on l'affiche dans la console
db.once("open", () => {
  // Lorsque la connexion à la base de données est établie avec succès, rien de spécial n'est fait ici.
});

// Définition d'une route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("Backend is running"); // Si on accède à la racine, le serveur répond avec "Backend is running"
});

// Importation des routeurs pour l'authentification et la gestion des tâches
const authRouter = require("./routes/auth"); // Routeur pour l'authentification des utilisateurs
app.use("/api/auth", authRouter); // Toutes les routes sous /api/auth seront gérées par authRouter

const tasksRouter = require("./routes/tasks"); // Routeur pour la gestion des tâches
app.use("/api", tasksRouter); // Toutes les routes sous /api seront gérées par tasksRouter

// Démarrage du serveur sur le port spécifié dans les variables d'environnement ou sur le port 3001 par défaut
const port = process.env.PORT || 3001; // Utilisation du port défini dans les variables d'environnement, sinon 3001
app.listen(port, () => {
  console.log("Server listening the port " + port); // Affichage dans la console quand le serveur démarre
});
