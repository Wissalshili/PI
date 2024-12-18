const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Tasks = require("../models/tasks");
const { authenticateToken } = require("../utils");

router.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await Tasks.find({
      created_by: req.user.username,
    });

    if (tasks.length === 0 || !tasks)
      return res.status(404).json({ msg: "Aucune tâche trouvée" });

    res.json(tasks);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.get("/task/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Tasks.findOne({
      _id: req.params.id,
      created_by: req.user.username,
    });

    if (task == null) {
      return res.status(404).json({ msg: "Impossible de trouver la tâche" });
    }

    res.json(task);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.post("/tasks", authenticateToken, async (req, res) => {
  try {
    if (
      req.body.title === undefined ||
      req.body.description === undefined ||
      req.body.deadline === undefined
    )
      return res
        .status(422)
        .json({ msg: "Veuillez fournir toutes les informations de la tâche" });

    const task = new Tasks({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      created_by: req.user.username,
    });

    await task.save();
    res.status(201).json({ msg: "Tâche créée", task });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.put("/tasks/:id", authenticateToken, async (req, res) => {
  const task = req.body.task;

  if (task === undefined)
    return res
      .status(422)
      .json({ msg: "Veuillez fournir les informations de la tâche" });

  try {
    const currentTask = await Tasks.findOne({
      _id: req.params.id,
      created_by: req.user.username,
    });

    if (currentTask == null) {
      return res.status(404).json({ msg: "Impossible de trouver la tâche" });
    }

    if (task.title !== null) currentTask.title = task.title;
    if (task.description !== null) currentTask.description = task.description;
    if (task.status !== null) currentTask.status = task.status;
    if (task.deadline !== null) currentTask.deadline = task.deadline;

    await currentTask.save();
    res.json(currentTask);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.delete("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const targetTask = await Tasks.findOne({
      _id: req.params.id,
      created_by: req.user.username,
    });

    if (targetTask) {
      targetTask.deleteOne();
      res.status(200).json({ msg: "Tâche supprimée" });
    } else {
      res.status(404).json({ msg: "Tâche non trouvée" });
    }
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
