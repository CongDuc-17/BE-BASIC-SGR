import TaskModel from "../../models/task.model.js";
import CommentModel from "../../models/comment.model.js";
import { now } from "mongoose";
import TaskRepository from "../../repositories/tasks.repository.js";
import SubBoardsRepository from "../../repositories/subBoards.repository.js";
import TeamsRepository from "../../repositories/teams.repository.js";
class TaskService {
  //create new task
  async createTask(taskData) {
    try {
      const task = await TaskRepository.createTask(taskData);
      return task;
    } catch (error) {
      console.error("Error in service create task:", error.message);
      throw error;
    }
  }
  //get all tasks
  async getAllTasks() {
    try {
      const tasks = await TaskRepository.getAllTasks();
      const taskResult = tasks.map((task) => ({
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
      }));
      return taskResult;
    } catch (error) {
      console.error("Error in service get all tasks:", error.message);
      throw error;
    }
  }
  //get task by id
  async getTaskById(taskId) {
    try {
      const task = await TaskRepository.getTaskById(taskId);
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
      return taskResult;
    } catch (error) {
      console.error("Error in service get task by id:", error.message);
      throw error;
    }
  }
  //update task by id
  async updateTaskById(taskId, taskData) {
    try {
      const updatedTask = await TaskRepository.updateTaskById(taskId, taskData);
      return updatedTask;
    } catch (error) {
      console.error("Error in service update task by id:", error.message);
      throw error;
    }
  }
  //delete task by id
  async deleteTaskById(taskId) {
    try {
      const deletedTask = await TaskRepository.deleteTaskById(taskId);
      return deletedTask;
    } catch (error) {
      console.error("Error in service delete task by id:", error.message);
      throw error;
    }
  }

  //---------------SubBoard Management -------------------
  async addSubBoardToTask(taskId, subBoardData) {
    try {
      const addSubBoard = await SubBoardsRepository.addSubBoardToTask(
        taskId,
        subBoardData
      );
      return addSubBoard;
    } catch (error) {
      console.error("Error in service add sub board to task:", error.message);
      throw error;
    }
  }

  async updateSubBoard(subBoardId, subBoardData) {
    try {
      const subBoard = await SubBoardsRepository.updateSubBoard(
        subBoardId,
        subBoardData
      );
      return subBoard;
    } catch (error) {
      console.error("Error in service update sub board:", error.message);
      throw error;
    }
  }

  async deleteSubBoard(subBoardId) {
    try {
      const subBoard = await SubBoardsRepository.deleteSubBoard(subBoardId);
      return subBoard;
    } catch (error) {
      console.error("Error in service delete sub board:", error.message);
      throw error;
    }
  }

  async uploadBG(subBoardId, filePath) {
    try {
      const subBoard = await SubBoardsRepository.uploadBG(subBoardId, filePath);
      return subBoard;
    } catch (error) {
      console.error("Error in service upload:", error.message);
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async addTeamToTask(taskId, teamId) {
    try {
      const addTeam = TeamsRepository.addTeamToTask(taskId, teamId);
      return addTeam;
    } catch (error) {
      console.error("Error in service add team to task:", error.message);
      throw error;
    }
  }
}
export default new TaskService();
