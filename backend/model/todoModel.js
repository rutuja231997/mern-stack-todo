const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const todoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: [true, "A todo must have title"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  dueDateAt: {
    type: Date,
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: { type: String, ref: "User", require: true },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
