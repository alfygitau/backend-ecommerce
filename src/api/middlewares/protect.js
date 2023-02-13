const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoutes = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired. Kindly login again");
    }
  } else {
    throw new Error("There is no token attached to the headers");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  let adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("Logged-in user is not an admin");
  } else {
    next();
  }
});

module.exports = { protectRoutes, isAdmin };
