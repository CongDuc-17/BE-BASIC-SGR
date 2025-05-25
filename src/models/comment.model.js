import mongoose from "mongoose";
import { ObjectId } from "mongodb";
const commentSchema = new mongoose.Schema({
  content: String,
  taskId: ObjectId,
  userId: { type: ObjectId, ref: "User" },
  createdAt: Date,
});
const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
