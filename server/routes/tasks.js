// Importation du module Express pour créer des routes
const express = require("express");

// Création d'un routeur Express
const router = express.Router();

// Importation du modèle des utilisateurs
const Users = require("../models/users");

// Importation du modèle des tâches
const Tasks = require("../models/tasks");

// Importation de la fonction middleware pour authentifier les jetons d'accès
const { authenticateToken } = require("../utils");

// Route pour récupérer toutes les tâches de l'utilisateur connecté
router.get("/tasks", authenticateToken, async (req, res) => {
  try {
    // Recherche des tâches créées par l'utilisateur connecté
    const tasks = await Tasks.find({
      created_by: req.user.username,
    });

    // Vérifie si aucune tâche n'a été trouvée
    if (tasks.length === 0 || !tasks)
      return res.status(404).json({ msg: "Aucune tâche trouvée" });

    // Renvoie les tâches trouvées
    res.json(tasks);
  } catch (e) {
    // Gestion des erreurs et envoi d'un message d'erreur
    res.status(500).json({ msg: e.message });
  }
});

// Route pour récupérer une tâche spécifique par son ID
router.get("/task/:id", authenticateToken, async (req, res) => {
  try {
    // Recherche d'une tâche par son ID et son créateur
    const task = await Tasks.findOne({
      _id: req.params.id,
      created_by: req.user.username,
    });

    // Vérifie si la tâche n'a pas été trouvée
    if (task == null) {
      return res.status(404).json({ msg: "Impossible de trouver la tâche" });
    }

    // Renvoie la tâche trouvée
    res.json(task);
  } catch (e) {
    // Gestion des erreurs et envoi d'un message d'erreur
    res.status(500).json({ msg: e.message });
  }
});

// Route pour créer une nouvelle tâche
router.post("/tasks", authenticateToken, async (req, res) => {
  try {
    // Vérifie si toutes les informations nécessaires sont fournies
    if (
      req.body.title === undefined ||
      req.body.description === undefined ||
      req.body.deadline === undefined
    )
      return res
        .status(422)
        .json({ msg: "Veuillez fournir toutes les informations de la tâche" });

    // Création d'une nouvelle tâche avec les données fournies
    const task = new Tasks({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      created_by: req.user.username,
    });

    // Sauvegarde de la tâche dans la base de données
    await task.save();

    // Renvoie une réponse avec un message de succès et la tâche créée
    res.status(201).json({ msg: "Tâche créée", task });
  } catch (e) {
    // Gestion des erreurs et envoi d'un message d'erreur
    res.status(500).json({ msg: e.message });
  }
});

// Route pour mettre à jour une tâche existante
router.put("/tasks/:id", authenticateToken, async (req, res) => {
  // Récupération de la tâche modifiée depuis la requête
  const task = req.body.task;

  // Vérifie si les données de la tâche sont fournies
  if (task === undefined)
    return res
      .status(422)
      .json({ msg: "Veuillez fournir les informations de la tâche" });

  try {
    // Recherche de la tâche existante par son ID et son créateur
    const currentTask = await Tasks.findOne({
      _id: req.params.id,
      created_by: req.user.username,
    });

    // Vérifie si la tâche n'a pas été trouvée
    if (currentTask == null) {
      return res.status(404).json({ msg: "Impossible de trouver la tâche" });
    }

    // Mise à jour des champs de la tâche avec les nouvelles données
    if (task.title !== null) currentTask.title = task.title;
    if (task.description !== null) currentTask.description = task.description;
    if (task.status !== null) currentTask.status = task.status;
    if (task.deadline !== null) currentTask.deadline = task.deadline;

    // Sauvegarde des modifications dans la base de données
    await currentTask.save();

    // Renvoie la tâche mise à jour
    res.json(currentTask);
  } catch (e) {
    // Gestion des erreurs et envoi d'un message d'erreur
    res.status(400).json({ msg: e.message });
  }
});

// Route pour supprimer une tâche
router.delete("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    // Recherche de la tâche par son ID et son créateur
    const targetTask = await Tasks.findOne({
      _id: req.params.id,
      created_by: req.user.username,
    });

    // Vérifie si la tâche existe
    if (targetTask) {
      // Suppression de la tâche
      targetTask.deleteOne();

      // Renvoie un message de succès
      res.status(200).json({ msg: "Tâche supprimée" });
    } else {
      // Si la tâche n'a pas été trouvée
      res.status(404).json({ msg: "Tâche non trouvée" });
    }
  } catch (e) {
    // Gestion des erreurs et envoi d'un message d'erreur
    res.status(500).json({ msg: e.message });
  }
});

// Exportation du routeur pour être utilisé dans d'autres fichiers
module.exports = router;
