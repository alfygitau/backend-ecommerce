const express = require("express");
const { protectRoutes, isAdmin } = require("../middlewares/protect");
const {
  uploadImage,
  resizeProductImages,
} = require("../middlewares/uploadFile");
const {
  uploadProductImages,
  deleteProductImages,
} = require("../controllers/upload");

const router = express.Router();

router.post(
  "/",
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

module.exports = router;
