const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadProductImages,
  deleteProductImages,
} = require("../controllers/product");
const { isAdmin, protectRoutes } = require("../middlewares/protect");
const {
  uploadImage,
  resizeProductImages,
} = require("../middlewares/uploadFile");

let router = express.Router();

router.put(
  "/upload",
  protectRoutes,
  isAdmin,
  uploadImage.array("images", 10),
  resizeProductImages,
  uploadProductImages
);

router.delete(
  "/delete-images/:id",
  protectRoutes,
  isAdmin,
  deleteProductImages
);

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
