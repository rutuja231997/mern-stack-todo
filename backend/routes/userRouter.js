const express = require("express");

const authMiddleware = require("../middleware/Middleware");

const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);

userRouter.post("/signin", userController.signin);

userRouter.get("/profile", authMiddleware, userController.fetchUser);

userRouter.put("/:id", authMiddleware, userController.updateData);

userRouter.delete("/:id", authMiddleware, userController.deleteUser);

userRouter.put(
  "/updatePassword/:id",
  authMiddleware,
  userController.passwordUpdate
);

module.exports = userRouter;
