import SubBoardModel from "../models/subboard.model.js";
import TaskModel from "../models/task.model.js";
import { uploadIMG } from "../service/uploadIMG.service.js";
class SubBoardRepository {
  async createSubBoard(dto) {
    const { name, taskId, background } = dto;
    const result = await SubBoardModel.create({ name, taskId, background });
    if (!result) throw new Error("Create sub board failed");
    return result;
  }
  async addSubBoardToTask(taskId, subBoardData) {
    const subBoard = await this.createSubBoard(subBoardData);
    const addSubBoard = await TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { subBoards: subBoard._id } },
      { new: true }
    );
    if (!addSubBoard) throw new Error("Task id not exists!");
    return addSubBoard;
  }
  async updateSubBoard(subBoardId, subBoardData) {
    const { name, taskId, background } = subBoardData;
    const result = await SubBoardModel.findByIdAndUpdate(
      subBoardId,
      {
        name: name,
        taskId: taskId,
        background: background,
      },
      { new: true }
    );
    if (!result) throw new Error("Update sub board failed");
    return result;
  }

  async deleteSubBoard(subBoardId) {
    const result = await SubBoardModel.findByIdAndDelete(subBoardId);
    if (!result) throw new Error("Id sub board not exists!");
    await TaskModel.updateMany(
      { subBoards: subBoardId },
      { $pull: { subBoards: subBoardId } }
    );
    return result;
  }

  async uploadBG(subBoardId, filePath) {
    const bgUrl = await uploadIMG(filePath);
    const subBoard = await SubBoardModel.findByIdAndUpdate(
      subBoardId,
      { background: bgUrl },
      { new: true }
    );
    if (!subBoard) throw new Error("Id sub board not exists!");
    return subBoard;
  }
}
export default new SubBoardRepository();
