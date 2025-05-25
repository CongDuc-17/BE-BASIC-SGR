import express from "express";
import TaskController from "./task.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import e from "express";
import taskController from "./task.controller.js";

const taskRoute = express.Router();
const subBoardRoute = express.Router();

taskRoute.post("", authMiddleware, TaskController.createTask);
taskRoute.get("", authMiddleware, TaskController.getAllTasks);
taskRoute.get("/:id", authMiddleware, TaskController.getTaskById);
taskRoute.patch("/:id", authMiddleware, TaskController.updateTaskById);
taskRoute.delete("/:id", authMiddleware, TaskController.deleteTaskById);

taskRoute.post(
  "/:id/subboards",
  authMiddleware,
  TaskController.addSubBoardToTask
);

taskRoute.patch(
  "/subboards/:id",
  authMiddleware,
  TaskController.updateSubBoard
);

taskRoute.delete(
  "/subboards/:id",
  authMiddleware,
  taskController.deleteSubBoard
);

taskRoute.post("/subboards/:id/upload-bg", taskController.uploadBG);

taskRoute.post("/:id/comments", authMiddleware, TaskController.addComment);
taskRoute.get("/:id/comments", authMiddleware, TaskController.allComment);

export default taskRoute;
