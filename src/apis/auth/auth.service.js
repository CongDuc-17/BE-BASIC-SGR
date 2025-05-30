import UserModel from "../../models/users.model.js";
import bcrypt from "bcrypt";
import { mailService } from "../../service/mail.service.js";
import { createJWT } from "../../service/createJWT.service.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import UserRepository from "../../repositories/users.repository.js";
class AuthService {
  //LOGIN
  async loginUser(username, password) {
    try {
      const userCurrent = await UserModel.findOne({ username: username });
      if (!userCurrent) {
        throw new Error("username incorrect!");
      }
      const pass = await bcrypt.compare(password, userCurrent.password);
      if (!pass) throw new Error("password incorrect!");
      const token = createJWT(userCurrent);
      return token;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
  //REGISTER
  async register(data) {
    try {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      const user = await UserRepository.create(data);
      return user;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
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
  //UPLOAD IMAGE
  constructor() {
    dotenv.config();
  }
  async uploadImages(username, folderPath) {
    try {
      // Cấu hình Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      console.log("Cloudinary Config:", cloudinary.config());

      // Đường dẫn thư mục chứa ảnh
      //const folderPath = "D:/CongDuc-17/BE Basic/BE-SGR/imageForUpload";

      // Lấy danh sách tất cả các file trong thư mục
      const files = fs
        .readdirSync(folderPath)
        .filter(
          (file) =>
            file.endsWith(".jpg") ||
            file.endsWith(".png") ||
            file.endsWith(".jpeg")
        );

      console.log(`🔍 Tìm thấy ${files.length} ảnh trong thư mục.`);
      const uploaded = [];
      // Upload từng ảnh
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        console.log(`📤 Đang upload: ${file} ...`);
        try {
          const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "uploaded_images", // Đặt thư mục trên Cloudinary
            resource_type: "image",
          });
          console.log(`✅ Upload thành công: ${file}`);
          console.log("🔗 URL:", uploadResult.secure_url);
          //Lưu vào DB
          const user = await UserModel.findOneAndUpdate(
            { username },
            { $push: { linkImages: uploadResult.secure_url } },
            { new: true }
          );
          if (user) {
            console.log("✅ Lưu vào DB thành công");
            console.log("🔗 URL:", uploadResult.secure_url);
            uploaded.push(uploadResult.secure_url);
          } else console.log(`⚠️ Không tìm thấy user: ${username}`);
        } catch (uploadError) {
          console.error(`❌ Lỗi khi upload ${file}:`, uploadError);
        }
      }
      console.log("🎉 Hoàn tất upload tất cả ảnh!");
      return {
        success: true,
        message: `Đã upload ${uploaded.length} ảnh.`,
        images: uploaded,
      };
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }

  //GET INFO USER
  async getInfoUser(id) {
    try {
      const user = await UserRepository.getOneById(id);
      return user;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
  //CHANGE INFO USER
  async changeInfoUser(id, data) {
    try {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
      const user = await UserRepository.updateOneById(id, data);
      return user;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
}

export default new AuthService();
