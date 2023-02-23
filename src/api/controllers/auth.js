const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../helpers/generateToken");
const validateMongoId = require("../helpers/validateId");
const generateRefreshToken = require("../helpers/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email");
const crypto = require("crypto");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const uniqid = require("uniqid");

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password, role } = req.body;

  let findUser = await User.findOne({ email });
  if (findUser) {
    // throw a new error
    throw new Error("User already exists");
  }
  let newUser = await new User({
    firstname,
    lastname,
    email,
    mobile,
    password,
    role,
  });
  let user = await newUser.save();
  res.status(201).json(user);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("Email or password missing");

  let user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    let refreshToken = await generateRefreshToken(user._id);
    let updatedUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    let { password, ...createdUser } = user._doc;
    res.json({
      _id: createdUser?._id,
      firstname: createdUser?.firstname,
      lastname: createdUser?.lastname,
      email: createdUser?.email,
      mobile: createdUser?.mobile,
      token: generateToken(createdUser._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("Email or password missing");

  let admin = await User.findOne({ email });

  if (admin.role !== "admin") throw new Error("User is not an admin");

  if (admin && (await admin.matchPassword(password))) {
    let refreshToken = await generateRefreshToken(admin._id);
    await User.findByIdAndUpdate(
      admin._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    letUpdatedAdmin = await User.findById(admin._id);
    let { password, ...createdUser } = letUpdatedAdmin._doc;
    res.json({
      _id: createdUser?._id,
      firstname: createdUser?.firstname,
      lastname: createdUser?.lastname,
      email: createdUser?.email,
      mobile: createdUser?.mobile,
      token: generateToken(createdUser._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    let users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    validateMongoId(userId);
    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoId(id);
    let user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, email, mobile } = req.body;
    let { id } = req.params;
    validateMongoId(id);

    let updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        email,
        mobile,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const saveUserAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  try {
    let updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req.body.address,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  let { id } = req.params;
  validateMongoId(id);
  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({
      message: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  let { id } = req.params;
  validateMongoId(id);
  try {
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({
      message: "User unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefresh = asyncHandler(async (req, res) => {
  let cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh token available");

  let refreshToken = cookie.refreshToken;
  let user = await User.findOne({ refreshToken });
  console.log(user.id);
  if (!user) throw new Error("No refresh token in the database");

  await jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {
    console.log(decoded.id);
    if (error || user.id !== decoded.id)
      throw new Error("There is something wrong with your refresh token");

    let accessToken = generateToken(user._id);
    res.json(accessToken);
  });
});

const logout = asyncHandler(async (req, res) => {
  let cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh token in cookies");

  let refreshToken = cookie.refreshToken;
  let user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.json({
    message: "User logged out",
  }); //forbidden
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  let { password } = req.body;
  validateMongoId(_id);

  let user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  let { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) throw new Error("User not found with the email");
  try {
    let token = await user.createPasswordResetToken();
    await user.save();
    let resetUrl = `Hello, kindly follow the link to reset your password. The link is valid for 10 minutes. 
    <a href="http://localhost:5000/api/user/reset-password/${token}">Click here</a>`;

    const data = {
      to: email,
      text: "Hey user",
      subject: "Forgot Password Link",
      htm: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  let hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  let user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token has expired, please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    let user = await User.findById(_id).populate("wishlist");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  let { cart } = req.body;
  const { _id } = req.user;
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if the user already have a cart
    let cartAlreadyExist = await Cart.findOne({ orderBy: user._id });

    // logic
    if (cartAlreadyExist) {
      cartAlreadyExist.remove();
    } else {
      for (let i = 0; i < cart.length; i++) {
        let obj = {};
        obj.product = cart[i]._id;
        obj.count = cart[i].count;
        obj.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id)
          .select("price")
          .exec();
        obj.price = getPrice.price;
        products.push(obj);
      }
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    let cart = await Cart.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    let user = await User.findOne({ _id });
    let cart = await Cart.findOneAndRemove({ orderBy: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  try {
    let validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("This coupon is invalid");
    }
    const user = await User.findOne({ _id });
    let { products, cartTotal } = await Cart.findOne({
      orderBy: user._id,
    }).populate("products.product");
    let totalAfterDiscout = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderBy: user._id },
      { totalAfterDiscout },
      { new: true }
    );
    res.json(totalAfterDiscout);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("create cash order failed");
    let user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderBy: user._id });

    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscout) {
      finalAmount = userCart.totalAfterDiscout;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "USD",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(update, {});

    res.json({ message: "Success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  let { _id } = req.user;
  try {
    let userOrders = await Order.findOne({ orderBy: _id })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    let allOrders = await Order.find({})
      .populate("products.product")
      .populate("orderBy")
      .exec();

    res.json(allOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  console.log(req.params)
  let { id } = req.params;
  try {
    let userOrders = await Order.findOne({ orderBy: id })
      .populate("products.product")
      .populate("orderBy")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  let { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefresh,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  adminLogin,
  getWishlist,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
};
