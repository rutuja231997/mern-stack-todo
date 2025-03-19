const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config("../example.env");

const User = require("../model/userModel");
const {
  signUpInput,
  signInInput,
  updateUserInput,
  passwordUpdateInput,
} = require("../types");

exports.signup = async (req, res) => {
  const createPayload = req.body;

  const email = createPayload.email;
  const username = `@${email.split("@")[0]}`;

  const validationData = signUpInput.safeParse(createPayload);

  if (!validationData.success) {
    return res.status(411).json({
      message: "Inputs wrong...!!!",
      error: validationData.error.errors,
    });
  }

  try {
    //hash the password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(createPayload.password, saltRound);

    const newUser = await User.create({
      name: createPayload.name,
      email: createPayload.email,
      username: username,
      password: hashedPassword, //store hash password
      createdAt: new Date(),
    });

    //generate jwt token
    const key = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, key, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      message: "user sign up successfully...!!!",
      user: newUser,
      token: token,
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "already user existed...!!!", status: 403 });
  }
};

exports.signin = async (req, res) => {
  const checkPayload = req.body;

  const parsePayload = signInInput.safeParse(checkPayload);

  if (!parsePayload.success) {
    return res.status(411).json({
      message: "Invalid Inputs..!!!",
    });
  }

  try {
    const existingUser = await User.findOne({
      email: checkPayload.email,
    }).select("+password");

    if (!existingUser) {
      return res.status(404).json({ message: "user not found...!!!" });
    }

    //compare password with hash password
    const isMatchPassword = await bcrypt.compare(
      checkPayload.password,
      existingUser.password
    );

    if (!isMatchPassword) {
      return res.status(401).json({ message: "Invalid password...!!!" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      message: "sign-in successfully...!!!",
      id: existingUser._id,
      token: token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error...!!!", error: err });
  }
};

exports.fetchUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log(userId);

    const user = await User.findById(userId);

    return res.status(200).json({
      message: "successfully fetch user details..!!!",
      user: user,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error..!!!", error: err });
  }
};

exports.updateData = async (req, res) => {
  const id = req.params.id;
  const updatedPayload = req.body;

  const parsedPayload = updateUserInput.safeParse(updatedPayload);

  if (!parsedPayload.success) {
    return res.status(411).json({ message: "Invalid inputs...!!!" });
  }

  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ message: "user not found...!!!" });
    }

    //update user data
    const updatedUser = await user.findByIdAndUpdate(id, updatedPayload, {
      new: true,
    });

    return res.status(200).json({
      message: "user updated successfully...!!!",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error...!!!",
      error: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const existingUser = await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({ message: "user delete account...!!!" });
  } catch (err) {
    return res.status(500).json({ message: "server error", error: err });
  }
};

exports.passwordUpdate = async (req, res) => {
  const id = req.params.id;
  const passwordPayload = req.body;

  const parsedPayload = passwordUpdateInput.safeParse(passwordPayload);

  if (!parsedPayload.success) {
    return res.status(411).json({
      message: "inputs are wrong...!!!",
      error: parsedPayload.error.errors,
    });
  }

  try {
    //hash the password
    const hashPassword = await bcrypt.hash(passwordPayload.password, 10);
    const existingUser = await User.findByIdAndUpdate(
      { _id: id },
      { Password: hashPassword },
      { new: true }
    );

    return res.status(200).json({
      message: "password successfully updated...!!!",
      existingUser: {
        name: existingUser.name,
        password: existingUser.password,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "internal sever error...!!!",
    });
  }
};
