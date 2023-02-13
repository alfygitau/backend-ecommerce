const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  getCoupon,
  deleteCoupon,
} = require("../controllers/coupon");
const { protectRoutes, isAdmin } = require("../middlewares/protect");

const router = express.Router();

router.post("/", protectRoutes, isAdmin, createCoupon);
router.get("/", getAllCoupons);

router.put("/:id", protectRoutes, isAdmin, updateCoupon);
router.get("/:id", protectRoutes, isAdmin, getCoupon);
router.delete("/:id", protectRoutes, isAdmin, deleteCoupon);

module.exports = router;
