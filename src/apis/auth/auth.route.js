import express from "express";
import AuthController from "./auth.controller.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", AuthController.registerUser);
authRoute.post("/login", AuthController.loginUser);
authRoute.post("/forgotPassword", AuthController.forgotPassword);
authRoute.post("/resetPassword", AuthController.resetPassword);
authRoute.post("/uploadImage", AuthController.uploadImages);
authRoute.get(
  "/me",
  authMiddleware,
  roleMiddleware("admin", "member"),
  AuthController.getInfoUser
);
authRoute.patch(
  "/me",
  authMiddleware,
  roleMiddleware("admin", "member"),
  AuthController.changeInfoUser
);

export default authRoute;
