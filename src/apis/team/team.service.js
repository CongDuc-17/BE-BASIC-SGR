import TeamRepository from "../../repositories/teams.repository.js";
class TeamService {
  async createTeam(dataTeam) {
    try {
      const team = await TeamRepository.createTeam(dataTeam);
      return team;
    } catch (error) {
      console.error("Error in create team:", error.message);
      throw error;
    }
  }
}
export default new TeamService();
