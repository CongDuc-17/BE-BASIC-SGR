import AuthService from "./auth.service.js";
class AuthController {
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const responseSer = await AuthService.loginUser(username, password);
      return res.status(200).json({
        token: responseSer,
      });
    } catch (error) {
      console.log("Login error:", error.message);
      return res.status(401).json({
        message: error.message,
      });
    }
  }
  //REGISTER
  async registerUser(req, res) {
    try {
      const newUser = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };
      const user = await AuthService.register(newUser);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: error.message,
      });
    }
  }
  //FORGOT PASSWORD
  async forgotPassword(req, res) {
    try {
      const mail = req.body.email;
      console.log("Email", mail);
      const responseSer = await AuthService.forgotPassword(mail);
      if (!responseSer) {
        return res.status(401).json({
          success: false,
          message: "Invalid email",
        });
      }
      req.user = responseSer; // để sau này kiểm tra với middleware

      return res.status(200).json({
        success: true,
        tokenReset: responseSer,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
  //RESET PASSWORD
  async resetPassword(req, res) {
    try {
      const { password, resetToken } = req.body;
      console.log("New password :", password, "\nToken reset: ", resetToken);
      const responseSer = await AuthService.resetPassword(password, resetToken);
      if (!responseSer || responseSer.success == false) {
        return res.status(401).json({
          success: false,
          message: "Invalid token reset",
        });
      }
      //req.user = responseSer;

      return res.status(200).json({
        success: true,
        message: "Password has been successfully reset.",
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
  //UPLOAD IMAGES
  async uploadImages(req, res) {
    try {
      const { username, folderPath } = req.body;
      const responseSer = await AuthService.uploadImages(username, folderPath);
      if (!responseSer || responseSer.success == false) {
        return res.status(401).json({
          success: false,
          message: "Invalid username",
        });
      }
      return res.status(200).json({
        responseSer,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
  //GET USER
  async getInfoUser(req, res) {
    try {
      const user = await AuthService.getInfoUser(req.user.id);
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: error.message,
      });
    }
  }
  //CHANGE INFO USER
  async changeInfoUser(req, res) {
    try {
      const { name, email, username, password } = req.body;
      const newInfo = {
        name,
        email,
        username,
        password,
      };
      const user = await AuthService.changeInfoUser(req.user.id, newInfo);
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      return res.status(200).json({
        message: "User information updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}

export default new AuthController();
