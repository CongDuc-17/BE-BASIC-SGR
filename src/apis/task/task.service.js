import SubBoardModel from "../../models/subboard.model.js";
import TaskModel from "../../models/task.model.js";
import CommentModel from "../../models/comment.model.js";
import { uploadIMG } from "../../service/uploadIMG.service.js";
import { now } from "mongoose";

class TaskService {
  //create new task
  async createTask(taskData) {
    try {
      const task = new TaskModel({
        title: taskData.title,
        description: taskData.description,
        dueTime: taskData.dueTime,
        documentLink: taskData.documentLink,
        githubRepo: taskData.githubRepo,
        creator: taskData.creator,
        subBoards: [],
        comments: [],
        createdAt: new Date(),
      });

      const savedTask = await task.save();
      return savedTask;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }
  //get all tasks
  async getAllTasks() {
    try {
      const tasks = await TaskModel.find()
        .populate("subBoards")
        .populate({
          path: "comments",
          populate: { path: "userId", select: "_id username" },
        })
        .populate("creator");
      const taskResult = tasks.map((task) => ({
        ...task.toObject(),
        subBoards: task.subBoards.map((sp) => ({
          name: sp.name,
          background: sp.background,
        })),
        comments: task.comments.map((cmt) => ({
          id: cmt.id,
          user: { id: cmt.userId._id, username: cmt.userId.username },
          content: cmt.content,
          createdAt: cmt.createdAt,
        })),
        creator: { id: task.creator._id, username: task.creator.username },
        createdAt: task.createdAt,
      }));
      return taskResult;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }
  //get task by id
  async getTaskById(taskId) {
    try {
      const task = await TaskModel.findById(taskId)
        .populate("subBoards")
        .populate({
          path: "comments",
          populate: { path: "userId", select: "_id username" },
        })
        .populate("creator");
      const taskResult = {
        ...task.toObject(),
        subBoards: task.subBoards.map((sp) => ({
          id: sp.id,
          name: sp.name,
          background: sp.background,
        })),
        comments: task.comments.map((cmt) => ({
          id: cmt.id,
          user: { id: cmt.userId._id, username: cmt.userId.username },
          content: cmt.content,
          createdAt: cmt.createdAt,
        })),
        creator: { id: task.creator._id, username: task.creator.username },
        createdAt: task.createdAt,
      };
      if (!task) return null;
      return taskResult;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }
  //update task by id
  async updateTaskById(taskId, taskData) {
    try {
      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { $set: taskData },
        { new: true }
      );
      return updatedTask;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }
  //delete task by id
  async deleteTaskById(taskId) {
    try {
      const deletedTask = await TaskModel.findByIdAndDelete(taskId);
      if (!deletedTask) return null;
      return deletedTask;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }

  //---------------SubBoard Management -------------------
  async addSubBoardToTask(taskId, subBoardData) {
    try {
      const checkSubBoardExist = await SubBoardModel.findOne({
        name: subBoardData.name,
      });
      if (checkSubBoardExist) return null;
      else {
        const subBoard = new SubBoardModel({
          name: subBoardData.name,
          taskId: taskId,
          background: subBoardData.background,
        });
        const saveSubBoard = await subBoard.save();
        const addSubBoard = await TaskModel.findByIdAndUpdate(
          taskId,
          { $push: { subBoards: saveSubBoard.id } },
          { new: true }
        );
        return addSubBoard;
      }
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }

  async updateSubBoard(subBoardId, subBoardData) {
    try {
      const subBoard = await SubBoardModel.findByIdAndUpdate(
        subBoardId,
        {
          name: subBoardData.name,
          background: subBoardData.background,
        },
        { new: true }
      );
      return subBoard;
    } catch (error) {
      console.error("Error in update sub board:", error.message);
      return null;
    }
  }

  async deleteSubBoard(subBoardId) {
    try {
      const subBoard = await SubBoardModel.findByIdAndDelete(subBoardId);
      await TaskModel.updateMany(
        { subBoards: subBoardId },
        { $pull: { subBoards: subBoardId } }
      );
      if (!subBoard) {
        return null;
      }
      return subBoard;
    } catch (error) {
      console.error("Error in service delete:", error.message);
      return null;
    }
  }

  async uploadBG(subBoardId, filePath) {
    try {
      const bgUrl = await uploadIMG(filePath);
      const subBoard = await SubBoardModel.findByIdAndUpdate(
        subBoardId,
        { background: bgUrl },
        { new: true }
      );
      if (!subBoard) return null;
      return subBoard;
    } catch (error) {
      console.error("Error in service upload:", error.message);
    }
  }

  //------------------Comment on Task--------------------
  async addComment(taskId, content, userId) {
    try {
      const comment = new CommentModel({
        userId: userId,
        taskId: taskId,
        content: content,
        createdAt: now(),
      });
      const saveComment = await comment.save();
      const addComment = await TaskModel.findByIdAndUpdate(
        taskId,
        { $push: { comments: saveComment.id } },
        { new: true }
      );
      return addComment;
    } catch (error) {
      console.error("Error in service add comment:", error.message);
    }
  }

  async allComment(taskId) {
    try {
      const allComment = await TaskModel.findById(taskId).populate("comments");
      if (!allComment) return null;
      const allCommentResult = {
        comment: allComment.comments.map((cmt) => ({
          content: cmt.content,
        })),
      };
      return allCommentResult;
    } catch (error) {
      console.error("Error in service get all comment:", error.message);
    }
  }
}
export default new TaskService();
