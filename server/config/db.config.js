const mongoose = require("mongoose");

const connectDB = async () => {
  let client = await mongoose.connect(process.env.MONGO_URL);
  console.log("Database is connected successfully");
};

module.exports = connectDB;
