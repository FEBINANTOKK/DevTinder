const mongoose = require("mongoose");
require("dotenv").config();
const dbUrl = process.env.MONGODB_URL;
console.log(dbUrl);

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000, // helps catch connection timeout errors quickly
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};

module.exports = connectDB;
