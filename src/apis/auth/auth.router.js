import express from "express";
import AuthController from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", AuthController.registerUser);
authRoute.post("/login", AuthController.loginUser);
authRoute.post("/forgotPassword", AuthController.forgotPassword);
authRoute.post("/resetPassword", AuthController.resetPassword);
authRoute.post("/uploadImage", AuthController.uploadImages);
authRoute.get("/me", authMiddleware, AuthController.getInfoUser);
authRoute.patch("/me", authMiddleware, AuthController.changeInfoUser);

export default authRoute;
