import { now } from "mongoose";
import TeamModel from "../models/team.model.js";
import TaskModel from "../models/task.model.js";

class TeamRepository {
  async createTeam(dto) {
    const { name, description, members, leader, tasks, createdAt, createdBy } =
      dto;
    const result = await TeamModel.create({
      name,
      description,
      members,
      leader,
      tasks,
      createdAt: now(),
      createdBy,
    });
    if (!result) throw new Error("Create team failed");
    return result;
  }

  async addTeamToTask(taskId, teamId) {
    const addTeam = await TaskModel.findByIdAndUpdate(
      taskId,
      { $set: { teamId: teamId } },
      { new: true }
    );
    if (!addTeam) throw new Error("Add team to tak failed");
    const addTaskToTeam = await TeamModel.findByIdAndUpdate(
      teamId,
      { $push: { tasks: taskId } },
      { new: true }
    );
    return addTeam;
  }
}
export default new TeamRepository();
