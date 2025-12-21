const mongoose = require("mongoose");
require("dotenv").config();
const dbUrl = process.env.MONGODB_URL;
console.log(dbUrl);

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Namesta002:6Go36BuyOTGKqW9c@namesta002.lbzilxl.mongodb.net/devTinder?retryWrites=true&w=majority",
      {
        serverSelectionTimeoutMS: 5000, // helps catch connection timeout errors quickly
      }
    );
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};

module.exports = connectDB;
