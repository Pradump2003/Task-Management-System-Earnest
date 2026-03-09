const jwt = require("jsonwebtoken");
const userCollection = require("../models/user.models")

const authenticate = async (req, res, next) => {
  let cookies = req?.cookies?.myCookie;
  if (!cookies) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, please log in to access this resource",
    });
    return;
  }
  let decodedToken = jwt.verify(cookies, process.env.JWT_SECRET_KEY);

  let decodedTokenId = decodedToken?.id;

  let myUser = await userCollection.findById(decodedTokenId);
  if (!myUser) {
    res.status(401).json({
      success: false,
      message: "Token Expired, please log in again",
    });
    return;
  }
  req.user = myUser;
  next();
};

module.exports = {
  authenticate,
};
