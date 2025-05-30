import express from "express";
import authRoute from "./auth/auth.route.js";
import taskRoute from "./task/task.route.js";
import teamRoute from "./team/team.route.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/tasks", taskRoute);
router.use("/teams", teamRoute);
export default router;
