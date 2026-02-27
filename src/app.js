const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("./utils/cronjob");
require("dotenv").config();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile2");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

// const profileRouter = require('./routes/profile')
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ frontend origin
    credentials: true,
  }),
);

const server = http.createServer(app);
initializeSocket(server);

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

connectDB()
  .then(() => {
    // console.log("Database connected successfully");
    server.listen("7777", () => {
      console.log("server sucessfully listerning");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
