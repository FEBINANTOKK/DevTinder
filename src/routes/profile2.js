const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bCrypt = require("bcrypt");
const { isStrongPassword } = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("error !!! " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Ypu try to Edit restricted one");
    }
    const loggedUser = req.user;
    console.log(loggedUser);
    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    await loggedUser.save();
    res.send(loggedUser);
  } catch (err) {
    res.status(400).send("error !!! " + err.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const loggedUser = req.user;

  try {
    const isMatch = await loggedUser.validatePassword(oldPassword);

    if (!isMatch) {
      throw new Error("Something Wrong in Password Change");
    }

    if (!isStrongPassword(newPassword)) {
      throw new Error("Password is not Enough Storang");
    }

    const hashedPassword = await bCrypt.hash(newPassword, 10);
    loggedUser.password = hashedPassword;
    await loggedUser.save();

    res.json({ Message: "Password change sucessfully", user: loggedUser });
  } catch (error) {
    res.status(200).send("Error !!" + error.message);
  }
});
module.exports = profileRouter;
