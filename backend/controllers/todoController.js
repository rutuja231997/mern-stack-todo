const Todo = require("../model/todoModel");
const User = require("../model/userModel");

const { createTodoInput, updateTodoInput } = require("../types");

exports.createTodo = async (req, res) => {
  const todoPayload = req.body;

  const userId = req.user?.userId;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "user not found...!!!" });
  }

  const validateTodo = createTodoInput.safeParse(todoPayload);

  if (!validateTodo.success) {
    return res.status(411).json({ message: "Inputs are wrong...!!!" });
  }

  try {
    const newTodo = await Todo.create({
      user: userId,
      title: todoPayload.title,
      description: todoPayload.description,
      dueDateAt: todoPayload.dueDateAt,
      priority: todoPayload.priority,
    });

    user.todos.push(newTodo._id);
    await user.save();

    return res
      .status(201)
      .json({ message: "todo created...!!!", todo: newTodo });
  } catch (err) {
    return res.status(500).json({
      message: "internal server error...!!!",
      error: err,
    });
  }
};

exports.updateTodo = async (req, res) => {
  const id = req.params.id;
  const todoPayload = req.body;

  const validateTodo = updateTodoInput.safeParse(todoPayload);

  if (!validateTodo.success) {
    return res.status(200).json({
      message: "Inputs are wrong...!!!",
      error: updateTodo.error.errors,
    });
  }

  try {
    const existingTodo = await Todo.findByIdAndUpdate(
      { _id: id },
      {
        title: todoPayload.title,
        description: todoPayload.description,
        dueDateAt: todoPayload.dueDateAt,
        priority: todoPayload.priority,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "todo is updated...!!!",
      existingTodo: existingTodo,
    });
  } catch (err) {
    return res.status(500).json({
      message: "internal server error...!!!",
      error: err,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  const id = req.params.id;

  try {
    const existingTodo = await Todo.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      message: "todo is delete..!!!",
      Todo: existingTodo,
    });
  } catch (err) {
    return res.status(500).json({
      message: "internal server error..!!!",
      error: err,
    });
  }
};

exports.getTodos = async (req, res) => {
  const userId = req.user?.userId;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(200).json({ message: "user not found...!!!" });
  }

  try {
    const todos = await Todo.find({ user: userId });
    return res.status(200).json({
      message: "todos render...!!!",
      todos,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error...!!!", error: err });
  }
};
