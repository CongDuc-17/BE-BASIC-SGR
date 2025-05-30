import express from "express";
import TaskController from "./task.controller.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../../middlewares/auth.middleware.js";

const taskRoute = express.Router();

taskRoute.post(
  "",
  authMiddleware,
  roleMiddleware("admin"),
  TaskController.createTask
);
taskRoute.get(
  "",
  authMiddleware,
  roleMiddleware("admin", "member"),
  TaskController.getAllTasks
);
taskRoute.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "member"),
  TaskController.getTaskById
);
taskRoute.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  TaskController.updateTaskById
);
taskRoute.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  TaskController.deleteTaskById
);

taskRoute.post(
  "/:id/subboards",
  authMiddleware,
  roleMiddleware("admin"),
  TaskController.addSubBoardToTask
);

taskRoute.patch(
  "/subboards/:id",
  authMiddleware,
  roleMiddleware("admin"),
  TaskController.updateSubBoard
);

taskRoute.delete(
  "/subboards/:id",
  authMiddleware,
  TaskController.deleteSubBoard
);

taskRoute.post("/subboards/:id/upload-bg", TaskController.uploadBG);

taskRoute.post(
  "/:id/comments",
  authMiddleware,
  roleMiddleware("admin", "member"),
  TaskController.addComment
);
taskRoute.get(
  "/:id/comments",
  authMiddleware,
  roleMiddleware("admin", "member"),
  TaskController.allComment
);

taskRoute.post(
  "/:id/teams",
  authMiddleware,
  roleMiddleware("admin", "member"),
  TaskController.addTeamToTask
);

export default taskRoute;
