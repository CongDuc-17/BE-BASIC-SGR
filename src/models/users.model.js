import mongoose from "mongoose";

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
  admin: {
    type: Boolean,
    default: false,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
