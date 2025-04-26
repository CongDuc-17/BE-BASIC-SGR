import UserModel from "../../models/users.model.js";
import { UserRepository } from "../../repositories/users.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mailService } from "../../service/mail.service.js";
import { createJWT } from "../../service/createJWT.service.js";
const userRepo = new UserRepository();

class AuthService {
  //LOGIN
  async loginUser(username, password) {
    try {
      const userCurrent = await UserModel.findOne({ username: username });
      if (!userCurrent) return { success: false, message: "Wrong username" };
      const pass = await bcrypt.compare(password, userCurrent.password);
      console.log(pass);
      if (!pass) return { success: false, message: "Wrong password" };
      // Tạo token
      const token = createJWT(userCurrent);
      return token;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  //REGISTER

  // FORGOT PASSWORD
  async forgotPassword(mail) {
    try {
      const userCurrent = await UserModel.findOne({ email: mail });
      console.log(mail);
      if (!userCurrent) return { success: false, message: "User not found" };
      const token = createJWT(userCurrent);
      userCurrent.resetToken = token;
      userCurrent.resetTokenExpire = new Date(Date.now() + 30 * 1000);
      await userCurrent.save();
      // mailService.sendMail(
      //   "duc17kd@gmail.com",
      //   "TOKEN FOR FORGOT PASSWORD",
      //   token
      // );
      return token;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  //RESET PASSWORD
  async resetPassword(newPassword, inputTokenReset) {
    try {
      const tokenResetOfUser = await UserModel.findOne({
        resetToken: inputTokenReset,
      });
      console.log(tokenResetOfUser);
      if (!tokenResetOfUser)
        return {
          success: false,
          message: "Token reset not exist",
        };
      if (tokenResetOfUser.resetTokenExpire.getTime() < Date.now()) {
        return {
          success: false,
          message: "Token reset expired",
        };
      }
      //sau khi kiểm tra->xóa token này đi để sau forgot password mới
      tokenResetOfUser.resetToken = null;
      tokenResetOfUser.resetTokenExpire = null;

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      tokenResetOfUser.password = hashed;
      await tokenResetOfUser.save();
      //mailService.sendMail("duc17kd@gmail.com", "NEW PASSWORD", newPassword);
      return {
        success: true,
        message: "Password reset successfully",
        inputTokenReset,
      };
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

export default new AuthService();
