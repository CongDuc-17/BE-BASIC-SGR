import { now } from "mongoose";
import TaskModel from "../models/task.model.js";
class TaskRepository {
  async createTask(dto) {
    const {
      title,
      description,
      dueTime,
      documentLink,
      githubRepo,
      creator,
      subBoards,
      comments,
      createdAt,
    } = dto;

    const result = await TaskModel.create({
      title,
      description,
      dueTime,
      documentLink,
      githubRepo,
      creator,
      subBoards,
      comments,
      createdAt: now(),
    });
    if (!result) throw new Error("Create task failed");
    return result;
  }

  async getAllTasks() {
    const allTasks = await TaskModel.find()
      .populate("subBoards")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "_id username" },
      })
      .populate("creator");
    if (allTasks.length === 0) throw new Error("NOT FOUND!");
    return allTasks;
  }

  async getTaskById(taskId) {
    const task = await TaskModel.findById(taskId)
      .populate("subBoards")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "_id username" },
      })
      .populate("creator");
    if (!task) throw new Error("Task not found!");
    return task;
  }

  async updateTaskById(taskId, taskData) {
    const newData = await TaskModel.findByIdAndUpdate(
      taskId,
      { $set: taskData },
      { new: true }
    );
    if (!newData) throw new Error("Task not found!");
    return newData;
  }

  async deleteTaskById(taskId) {
    const task = await TaskModel.findByIdAndDelete(taskId);
    if (!task) throw new Error("Task not found!");
    return task;
  }
}
export default new TaskRepository();
