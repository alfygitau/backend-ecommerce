const express = require("express");
const {
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
} = require("../controllers/auth");
const { protectRoutes, isAdmin } = require("../middlewares/protect");

const router = express.Router();

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

// get all orders
router.get("/all-user-orders", protectRoutes, getAllOrders);

// forgot password
router.post("/forgot-password-token", forgotPasswordToken);

// reset password
router.put("/reset-password/:token", resetPassword);

// update password
router.put("/password", protectRoutes, updatePassword);

// all users
router.get("/all-users", getAllUsers);

// refresh
router.get("/refresh", handleRefresh);

// logout
router.get("/logout", logout);

// get a wish list
router.get("/wishlist", protectRoutes, getWishlist);

router.post("/cart", protectRoutes, userCart);

router.get("/cart", protectRoutes, getUserCart);

router.delete("/empty-cart", protectRoutes, emptyCart);

router.post("/cart/apply-coupon", protectRoutes, applyCoupon);

// order
router.post("/cart/create-order", protectRoutes, createOrder);

// get all orders
router.get("/all-user-orders", protectRoutes, getAllOrders);

// get user orders
router.get("/orders", protectRoutes, getOrders);

// update order status
router.put(
  "/order/update-order/:id",
  protectRoutes,
  isAdmin,
  updateOrderStatus
);

// save user address
router.put("/save-address", protectRoutes, saveUserAddress);

// get a single user
router.get("/:userId", protectRoutes, isAdmin, getUser);

// delete a user
router.delete("/:id", protectRoutes, isAdmin, deleteUser);

// update user
router.put("/:id", protectRoutes, isAdmin, updateUser);

// block and unblock
router.put("/block-user/:id", protectRoutes, isAdmin, blockUser);
router.put("/unblock-user/:id", protectRoutes, isAdmin, unBlockUser);

module.exports = router;
