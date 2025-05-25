import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueTime: Date,
  documentLink: String,
  githubRepo: String,
  creator: { type: ObjectId, ref: "User" },
  //teamId: ObjectId,
  subBoards: [{ type: ObjectId, ref: "SubBoard" }],
  comments: [{ type: ObjectId, ref: "Comment" }],
  createdAt: Date,
});

const TaskModel = mongoose.model("Task", taskSchema);
export default TaskModel;
