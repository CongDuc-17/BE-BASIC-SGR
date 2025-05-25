import TaskService from "./task.service.js";
class TaskController {
  async createTask(req, res) {
    try {
      const taskData = {
        title: req.body.title,
        description: req.body.description,
        dueTime: req.body.dueTime,
        documentLink: req.body.documentLink,
        githubRepo: req.body.githubRepo,
        creator: req.user.id,
      };
      const task = await TaskService.createTask(taskData);
      if (!task) {
        return res.status(400).json({
          message: "Create task failed",
        });
      }
      return res.status(200).json({
        message: "Create task successfully",
        task,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  //get all tasks
  async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();
      if (!tasks) {
        return res.status(400).json({
          message: "Get tasks failed",
        });
      }
      return res.status(200).json({
        message: "Get tasks successfully",
        tasks,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  //get task by id
  async getTaskById(req, res) {
    try {
      const taskId = req.params.id;
      const task = await TaskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }
      return res.status(200).json({
        message: "Get task successfully",
        task,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  //update task by id
  async updateTaskById(req, res) {
    try {
      const taskId = req.params.id;
      if (req.user.role === "admin") {
        const taskData = {
          title: req.body.title,
          description: req.body.description,
          dueTime: req.body.dueTime,
          documentLink: req.body.documentLink,
          githubRepo: req.body.githubRepo,
        };
        const task = await TaskService.updateTaskById(taskId, taskData);
        if (!task) {
          return res.status(400).json({
            message: "Update task failed",
          });
        }
        return res.status(200).json({
          message: "Update task successfully",
          task,
        });
      } else {
        return res.status(403).json({
          message: "Permission denied",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  //delete task by id
  async deleteTaskById(req, res) {
    try {
      const taskId = req.params.id;
      if (req.user.role === "admin") {
        const task = await TaskService.deleteTaskById(taskId);
        if (!task) {
          return res.status(400).json({
            message: "Delete task failed or task not found",
          });
        }
        return res.status(200).json({
          message: "Delete task successfully",
        });
      } else {
        return res.status(403).json({
          message: "Permission denied",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  //---------------------SubBoard Management ---------------------
  async addSubBoardToTask(req, res) {
    try {
      if (req.user.role === "admin") {
        const taskId = req.params.id;
        const subBoardData = {
          name: req.body.name,
          background: req.body.background,
        };
        const subBoard = await TaskService.addSubBoardToTask(
          taskId,
          subBoardData
        );
        if (!subBoard) {
          return res.status(400).json({
            message: "SubBoard already exists or failed to add sub board",
          });
        }
        return res.status(200).json({
          message: "Add sub board success <3",
        });
      } else
        return res.status(403).json({
          message: "Permission denied",
        });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  async updateSubBoard(req, res) {
    try {
      if (req.user.role === "admin") {
        const subBoardId = req.params.id;
        const subBoardData = {
          name: req.body.name,
          background: req.body.background,
        };
        const subBoard = await TaskService.updateSubBoard(
          subBoardId,
          subBoardData
        );
        if (!subBoard) {
          return res.status(400).json({
            message: "Sub board not found",
          });
        }
        return res.status(200).json({
          message: "Update sub board success <3",
        });
      } else
        return res.status(403).json({
          message: "Permission denied",
        });
    } catch (error) {
      console.error("Error in update sub board:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async deleteSubBoard(req, res) {
    try {
      if (req.user.role === "admin") {
        const subBoardId = req.params.id;
        const subBoard = await TaskService.deleteSubBoard(subBoardId);
        if (!subBoard) {
          return res.status(400).json({
            message: "Sub board not found =))",
          });
        }
        return res.status(200).json({
          message: "Delete sub board success <3",
        });
      } else
        return res.status(403).json({
          message: "Permission denied",
        });
    } catch (error) {
      console.error("Error in delete sub board:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async uploadBG(req, res) {
    try {
      const subBoardId = req.params.id;
      const filePath = req.body.filePath;
      const subBoard = await TaskService.uploadBG(subBoardId, filePath);
      if (!subBoard)
        return res.status(400).json({
          message: "Sub board not found =))",
        });
      return res.status(200).json({ message: "Upload background success <3" });
    } catch (error) {
      console.error("Error in upload:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  //------------------------------------Comment on Task-----------------------------
  async addComment(req, res) {
    try {
      const taskId = req.params.id;
      const content = req.body.content;
      const userId = req.user.id;
      const comment = await TaskService.addComment(taskId, content, userId);
      if (!comment)
        return res.status(400).json({
          message: "Task not found=((",
        });
      return res.status(200).json({
        message: "add comment success <3",
      });
    } catch (error) {
      console.error("Error in comment:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async allComment(req, res) {
    try {
      const taskId = req.params.id;
      const allComment = await TaskService.allComment(taskId);
      if (!allComment)
        return res.status(400).json({ message: "Task not found =((" });
      return res.status(200).json({
        allComment,
      });
    } catch (error) {
      console.error("Error in all comment:", error.message);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
export default new TaskController();
