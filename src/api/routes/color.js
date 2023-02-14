const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getColors,
} = require("../controllers/color");
const { isAdmin, protectRoutes } = require("../middlewares/protect");

const router = express.Router();

router.post("/", protectRoutes, isAdmin, createColor);
router.put("/:id", protectRoutes, isAdmin, updateColor);
router.delete("/:id", protectRoutes, isAdmin, deleteColor);
router.get("/:id", getColor);

router.get("/", getColors);

module.exports = router;
