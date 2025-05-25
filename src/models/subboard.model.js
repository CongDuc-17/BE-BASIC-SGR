import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const subBoardSchema = new mongoose.Schema({
  name: String,
  taskId: ObjectId,
  background: String,
});

const SubBoardModel = mongoose.model("SubBoard", subBoardSchema);
export default SubBoardModel;
