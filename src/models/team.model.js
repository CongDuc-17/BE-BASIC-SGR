import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: ObjectId, ref: "User" }],
  leader: { type: ObjectId, ref: "User" },
  tasks: [{ type: ObjectId, ref: "Task" }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: ObjectId, ref: "User" },
});

const TeamModel = mongoose.model("Team", teamSchema);
export default TeamModel;
