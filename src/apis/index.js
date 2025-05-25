import express from "express";
import authRoute from "./auth/auth.router.js";
import taskRoute from "./task/task.router.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/tasks", taskRoute);

export default router;
