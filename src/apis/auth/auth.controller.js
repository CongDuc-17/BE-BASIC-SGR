import { json } from "express";
import UserModel from "../../models/users.model.js";
import AuthService from "./auth.service.js";
import bcrypt from "bcrypt";

class AuthController {
  async loginUser(req, res) {
    // try {
    //   const userLogin = req.body;
    //   const username = userLogin.name;
    //   const password = userLogin.password;
    //   console.log("username:", username);
    //   const responseSer = await AuthService.loginUser(username, password);
    //   if (!responseSer)
    //     return res.status(500).json({
    //       success: false,
    //       message: error.message,
    //     });
    //   req.user = token;

    //   return res.status(200).json({
    //     success: true,
    //     // data: userLogin
    //     data: token,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(401).json({
    //     success: false,
    //     message: error.message,
    //   });
    // }
    const { username, password } = req.body;
    console.log("username:", username);

    const responseSer = await AuthService.loginUser(username, password);
    if (!responseSer) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    req.user = responseSer;

    return res.status(200).json({
      success: true,
      token: responseSer,
    });
  }
  catch(error) {
    console.log("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  //REGISTER
  async registerUser(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = await new UserModel({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        createdAt: req.body.createdAt,
        password: hashed,
      });

      //Save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
