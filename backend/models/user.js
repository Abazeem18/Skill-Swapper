import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  supabaseId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  skillsOffered: {
    type: [String],
    default: []
  },
  skillsWanted: {
    type: [String],
    default: []
  }
});

export default mongoose.model("User", userSchema);
