const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decoded = jwt.verify(token, "DEV@Tinder$2004");
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    console.log(user);

    next();
  } catch (err) {
    res.status(400).send("error !!! " + err.message);
  }
};

module.exports = {
  userAuth,
};
