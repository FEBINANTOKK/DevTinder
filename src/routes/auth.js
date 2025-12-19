const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { isValidateData } = require("../utils/validation");
const bCrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  try {
    isValidateData(req);
    // hash password
    const hashedPassword = await bCrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    console.log("febin" + token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res
      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("error !!! " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Ivalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Ivalid Credentials");
    } else {
      const token = await user.getJWT();
      console.log("febin" + token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error: " + error.message });
  }
});
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout sucessfull");
});
module.exports = authRouter;
