const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  score: Number,
  skills: [String],
  jobs: [String],
  missing_skills: [String]
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);