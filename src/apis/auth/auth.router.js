import express from "express";
import AuthController from "./auth.controller.js";
import { UserRepository } from "../../repositories/users.repository.js";
import authService from "./auth.service.js";

const authRoute = express.Router();

authRoute.post("/register", AuthController.registerUser);
authRoute.post("/login", AuthController.loginUser);
authRoute.post("/forgotPassword", AuthController.forgotPassword);
authRoute.post("/resetPassword", AuthController.resetPassword);
authRoute.post("/uploadImage", AuthController.uploadImages);

export default authRoute;
