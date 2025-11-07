const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.id;
    const fromUserId = req.user.id;
    const status = req.params.status;

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
    console.log(isconnectionRequestAlreadyExist);

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
  }
);
module.exports = requestRouter;
