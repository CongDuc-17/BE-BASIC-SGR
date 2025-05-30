import UserModel from "../models/users.model.js";

class UserRepository {
  async create(dto) {
    const { name, email, password, username, role } = dto;

    const result = await UserModel.create({
      name,
      email,
      password,
      username,
      role,
    });
    if (!result) throw new Error("Created failed");
    return {
      name,
      email,
      id: String(result._id),
    };
  }

  async getOneById(id) {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new Error("not found");
    }

    return {
      id: String(user._id),
      name: String(user.name),
      email: String(user.email),
    };
  }

  async getAll() {
    const users = await UserModel.find();
    if (!users) throw new Error("Not found user");

    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }));
  }

  async deleteOneById(id) {
    const deletedUser = await UserModel.findOneAndDelete({ _id: id }).lean();
    if (!deletedUser) throw new Error("not found");

    return {
      id: String(deletedUser._id),
      name: deletedUser.name,
      email: deletedUser.email,
    };
  }

  async updateOneById(id, data) {
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
        },
      },
      { new: true }
    );
    if (!updateUser) throw new Error("Not found");
    return updateUser;
  }
}

export default new UserRepository();
