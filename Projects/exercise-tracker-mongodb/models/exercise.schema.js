const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: Date,
  duration: Number,
  description: String,
});
const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
