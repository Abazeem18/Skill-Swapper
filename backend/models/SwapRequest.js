import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema({
  fromUser: {
    type: String,
    required: true
  },
  toUser: {
    type: String,
    required: true
  },
  offeredSkill: {
    type: String,
    required: true
  },
  requestedSkill: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  }
});

export default mongoose.model("SwapRequest", swapRequestSchema);
