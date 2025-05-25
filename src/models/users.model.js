import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpire: {
    type: Date,
    default: null,
  },
  linkImages: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member",
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
