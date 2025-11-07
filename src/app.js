const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile2");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// const profileRouter = require('./routes/profile')
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    // console.log("Database connected successfully");
    app.listen("7777", () => {
      console.log("server sucessfully listerning");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
