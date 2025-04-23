import express from "express";
import AuthController from "./auth.controller.js";
import { UserRepository } from "../../repositories/users.repository.js";

const authRoute = express.Router();

//authRoute.post("/example", AuthController.example);
authRoute.post("/register", AuthController.registerUser);
authRoute.post("/login", AuthController.loginUser);

export default authRoute;
