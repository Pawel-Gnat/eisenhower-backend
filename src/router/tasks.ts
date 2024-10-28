import express from "express";

import {
  getAllTasks,
  createNewTask,
  deleteAllTasks,
  deleteTask,
  updateTask,
} from "../controllers/tasks";

import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.get("/tasks", isAuthenticated, getAllTasks);
  router.post("/tasks", isAuthenticated, createNewTask);
  router.delete("/tasks", isAuthenticated, deleteAllTasks);
  router.patch("/tasks/:id", isAuthenticated, updateTask);
  router.delete("/tasks/:id", isAuthenticated, deleteTask);
};
