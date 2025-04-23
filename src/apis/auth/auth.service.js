import UserModel from "../../models/users.model.js";
import { UserRepository } from "../../repositories/users.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepo = new UserRepository();

class AuthService {
  async loginUser(username, password) {
    // try {
    //   const newUser = await userRepo.create({
    //     name: username,
    //     password: password,
    //   });

    //   console.log("Created user:", newUser);

    //   const allUsers = await userRepo.getAll();
    //   console.log("All users:", allUsers);
    // } catch (error) {
    //   console.error("Error:", error.message);
    // }
    try {
      const userCurrent = await UserModel.findOne({ username: username });
      if (!userCurrent) {
        res.status(404).json("Wrong name");
      }
      const pass = await bcrypt.compare(password, userCurrent.password);
      if (!pass) {
        res.status(400).json("Wrong password");
      }
      // Tạo token
      const token = jwt.sign(
        { id: userCurrent._id, username: userCurrent.username },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );
      return token;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

export default new AuthService();
