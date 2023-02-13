const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands,
} = require("../controllers/brand");
const { isAdmin, protectRoutes } = require("../middlewares/protect");

const router = express.Router();

router.post("/", protectRoutes, isAdmin, createBrand);
router.put("/:id", protectRoutes, isAdmin, updateBrand);
router.delete("/:id", protectRoutes, isAdmin, deleteBrand);
router.get("/:id", getBrand);

router.get("/", getBrands);

module.exports = router;
