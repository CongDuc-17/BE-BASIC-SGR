import { now } from "mongoose";
import TeamService from "./team.service.js";
class TeamController {
  async createTeam(req, res) {
    try {
      const teamData = {
        name: req.body.name,
        description: req.body.description,
        members: req.body.members,
        leader: req.body.leader,
        tasks: req.body.tasks,
        createdAt: now(),
        createdBy: req.user.id,
      };
      const team = await TeamService.createTeam(teamData);
      return res.status(200).json({
        message: "Create task successfully",
        team,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(404).json({ message: "Create team failed=((" });
    }
  }
}
export default new TeamController();
