// Importation des modules nécessaires
const express = require("express");
const router = express.Router(); // Création d'un routeur pour définir les routes liées à l'authentification
const RefreshTokens = require("../models/refresh"); // Modèle pour les jetons d'actualisation
const Users = require("../models/users"); // Modèle pour les utilisateurs
const bcrypt = require("bcryptjs"); // Librairie pour le hashage des mots de passe
const jwt = require("jsonwebtoken"); // Librairie pour générer et vérifier des jetons JWT
const { generateAccessToken } = require("../utils"); // Fonction personnalisée pour générer un access token

// Route : Enregistrement d'un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    // Vérification que les champs username et password sont fournis
    if (!req.body.username || !req.body.password)
      return res
        .status(400)
        .send({ msg: "Username and password are required" });

    const username = req.body.username;

    // Vérification si le nom d'utilisateur existe déjà
    if (
      await Users.findOne({
        username: username,
      })
    )
      return res.status(400).send({ msg: "Username already exists" });

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création d'un objet utilisateur
    const userClient = { username: username, password: hashedPassword };

    // Enregistrement de l'utilisateur dans la base de données
    const newUser = new Users(userClient);
    await newUser.save();

    // Réponse en cas de succès
    res.status(201).json({ msg: "User created" });
  } catch (e) {
    res.status(500); // Réponse en cas d'erreur interne
  }
});

// Route : Connexion utilisateur
router.post("/login", async (req, res) => {
  try {
    // Extraction des données envoyées par l'utilisateur
    const userClient = {
      username: req.body.username,
      password: req.body.password,
    };

    // Vérification que les champs sont fournis
    if (!userClient.username || !userClient.password)
      return res
        .status(400)
        .send({ msg: "Username and password are required" });

    // Recherche de l'utilisateur dans la base de données
    const user = await Users.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(400).send({ msg: "Username does not exist" });
    }

    // Comparaison des mots de passe
    const realPassword = await bcrypt.compare(req.body.password, user.password);
    if (!realPassword) {
      return res.status(400).send({ msg: "Incorrect password" });
    }

    // Génération d'un access token
    const accessToken = generateAccessToken({
      username: userClient.username,
      userId: user._id,
    });

    // Génération d'un refresh token
    const refreshToken = jwt.sign(
      { username: userClient.username },
      process.env.REFRESH_TOKEN_SECRET
    );

    // Enregistrement du refresh token dans la base de données
    const newRefreshToken = new RefreshTokens({
      username: userClient.username,
      refreshToken: refreshToken,
    });
    await newRefreshToken.save();

    // Réponse avec les tokens
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (e) {
    res.status(500); // Réponse en cas d'erreur interne
  }
});

// Route : Actualisation de l'access token
router.post("/refresh_token", async (req, res) => {
  try {
    const refreshToken = req.body.token;

    // Vérification que le token est fourni
    if (refreshToken == null) return res.sendStatus(401);

    // Recherche du token dans la base de données
    const user = await RefreshTokens.findOne({ refreshToken: refreshToken });
    if (!user?._id) return res.sendStatus(403);

    const myUser = await Users.findOne({ username: user.username });

    // Vérification de la validité du refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      // Génération d'un nouvel access token
      const accessToken = generateAccessToken({
        username: user.username,
      });
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    });
  } catch (e) {
    res.status(500); // Réponse en cas d'erreur interne
  }
});

// Route : Déconnexion utilisateur
router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.body.token;

    // Suppression du refresh token de la base de données
    await RefreshTokens.deleteOne({ refreshToken: refreshToken });

    // Réponse en cas de succès
    res.status(200).json({ msg: "Logged out" });
  } catch (e) {
    res.status(500); // Réponse en cas d'erreur interne
  }
});

// Exportation du routeur pour utilisation dans l'application principale
module.exports = router;
