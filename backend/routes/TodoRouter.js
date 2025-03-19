const express = require("express");

const {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} = require("../controllers/todoController");

const authMiddleware = require("../middleware/Middleware");

const todoRouter = express.Router();

todoRouter.post("/", authMiddleware, createTodo);

todoRouter.put("/:id", authMiddleware, updateTodo);

todoRouter.delete("/:id", authMiddleware, deleteTodo);

todoRouter.get("/", authMiddleware, getTodos);

module.exports = todoRouter;
