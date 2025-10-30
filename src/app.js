const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { isValidateData } = require("./utils/validation");
const bCrypt = require("bcrypt");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(userEmail + " this is email");

  try {
    // const users = await User.find({ emailId: userEmail });
    // const users = await User.find({ emailId: userEmail });
    // if (users.length == 0) {
    //      res.status(404).send("User not found");
    //     } else {
    //       res.send(user);
    //     }
    //   } catch (err) {
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

    const user = await User.findOne({ emailId: userEmail });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId + " this is userId");

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {}
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  const updateData = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "gender", "about", "age", "skills"];
    const isUpdateAllowed = Object.keys(updateData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    console.log(isUpdateAllowed);

    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed");
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: false,
      runValidators: true,
    });
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error " + error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello from DevTinder Backend");
});

app.post("/signup", async (req, res) => {
  const { firstName, emailId, password } = req.body;

  try {
    isValidateData(req);
    // hash password
    const hashedPassword = await bCrypt.hash(password, 10);

    const user = new User({ firstName, emailId, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("error !!! " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Ivalid Credentials");
    }
    const isPasswordValid = await bCrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Ivalid Credentials");
    } else {
      res.send("Login sucessfully");
    }
  } catch (error) {
    res.send("Error " + error.message);
  }
});
app.use("/", (err, req, res, next) => {
  res.send("We got error @@@ " + err.message);
});

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
