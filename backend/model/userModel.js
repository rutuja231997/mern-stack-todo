const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: [true, "A user must fill name like name surname"],
    trim: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  todos: [{ type: String, ref: "Todo" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
