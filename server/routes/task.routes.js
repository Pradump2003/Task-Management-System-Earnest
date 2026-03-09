const { Router } = require("express");
const {
  allTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controllers");
const { authenticate } = require("../middlewares/auth.middleware");

const taskRoutes = Router();

taskRoutes.get("/tasks", authenticate, allTasks);
taskRoutes.post("/tasks", authenticate, createTask);
taskRoutes.patch("/tasks/:id", authenticate, updateTask);
taskRoutes.delete("/tasks/:id", authenticate, deleteTask);

module.exports = taskRoutes;
