require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes")
const taskRoutes = require("./routes/task.routes")

const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, 
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/v1/users", userRoutes);
app.use("/v1/tasks", taskRoutes);


app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
