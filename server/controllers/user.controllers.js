const userCollection = require("../models/user.models");
const asyncHandler = require("express-async-handler");
const generateJWTToken = require("../utils/jwt.utils");

const registerUser = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;
  let newUser = await userCollection.create({
    username,
    email,
    password,
  });
  res.status(201).json({
    success: true,
    message: "user registered successfully",
    data: newUser,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  let user = await userCollection.findOne({ email });
  if (!user){
    res.status(404).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }

  let isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(404).json({
      success: false,
      message: "invalid credentials",
    });
    return;
  }

  let token = generateJWTToken(user._id);
  res.cookie("myCookie", token, {
    maxAge: 1 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "user logged in successfully",
    token,
  });
});



module.exports = {
  registerUser,
  loginUser,
};


