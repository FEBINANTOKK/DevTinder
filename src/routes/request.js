const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.id;
    const fromUserId = req.user.id;
    const status = req.params.status;
    const touser = await User.findById(toUserId);
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status" + status,
      });
    }

    const isconnectionRequestAlreadyExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (isconnectionRequestAlreadyExist) {
      //   throw new Error("Connection Already Exist");
      return res.json({ message: "Error  connection already exist" });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    const emailRes = await sendEmail.run(
      "A new Friend request from " + req.user.firstName,
      req.user.firstName + " is " + status + " in " + touser.firstName,
    );

    res.json({
      message: "Connection request send",
      data,
    });
  } catch (error) {
    res.status(404).send("Error" + error.message);
  }
});
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.send("Status is not right");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.send("Connection not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection " + status, data });
    } catch (error) {
      res.send("Error occured" + error.message);
    }
  },
);
module.exports = requestRouter;
