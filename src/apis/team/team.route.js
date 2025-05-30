import express from "express";
import TeamController from "./team.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const teamRoute = express.Router();
teamRoute.post("/createTeam", authMiddleware, TeamController.createTeam);
export default teamRoute;
