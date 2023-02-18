const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controllers/product");
const { isAdmin, protectRoutes } = require("../middlewares/protect");

let router = express.Router();

router
  .route("/")
  .post(protectRoutes, isAdmin, createProduct)
  .get(getAllProducts);
router.put("/rating", protectRoutes, rating);
router.get("/:id", getSingleProduct);
router.put("/wishlist", protectRoutes, addToWishlist);

router.put("/:id", protectRoutes, isAdmin, updateProduct);
router.delete("/:id", protectRoutes, isAdmin, deleteProduct);

module.exports = router;
