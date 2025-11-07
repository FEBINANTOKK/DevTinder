const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { skipMiddlewareFunction } = require("mongoose");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl");
    if (connectionRequests.length == 0) {
      return res.send("No request");
    }
    res.json({
      message: "You have the following requests",
      connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: "Erroe " + error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() == loggedUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    if (connections.length == 0) {
      throw new Error("No connection you Yet have");
    }
    res.json({ message: "Data send Sucessfully", data });
  } catch (error) {
    res.send("Err0r" + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;
    skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ users });
  } catch (error) {
    res.json({ message: "Error" + error.message });
  }
});

module.exports = userRouter;
