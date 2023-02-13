const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
} = require("../controllers/productcategory");
const { isAdmin, protectRoutes } = require("../middlewares/protect");

const router = express.Router();

router.post("/", protectRoutes, isAdmin, createCategory);
router.put("/:id", protectRoutes, isAdmin, updateCategory);
router.delete("/:id", protectRoutes, isAdmin, deleteCategory);
router.get("/:id", getCategory);

router.get("/", getCategories);

module.exports = router;
