require("dotenv").config({ path: "./example.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const todoRouter = require("./routes/TodoRouter");
const dbConnection = require("./db_connect");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello rutuja kamble");
});

app.listen(port, async () => {
  await dbConnection();
  console.log(`app running on port http://localhost:${port}/`);
});
