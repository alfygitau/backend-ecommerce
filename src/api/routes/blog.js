const express = require("express");
const {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadBlogImages,
} = require("../controllers/blog");
const { isAdmin, protectRoutes } = require("../middlewares/protect");
const { uploadImage, resizeBlogImages } = require("../middlewares/uploadFile");

const router = express.Router();

router.put(
  "/upload/:id",
  protectRoutes,
  isAdmin,
  uploadImage.array("images", 10),
  resizeBlogImages,
  uploadBlogImages
);

router.post("/", protectRoutes, isAdmin, createBlog);
router.put("/likes", protectRoutes, likeBlog);
router.put("/dislikes", protectRoutes, dislikeBlog);
router.put("/:id", protectRoutes, isAdmin, updateBlog);
router.delete("/:id", protectRoutes, isAdmin, deleteBlog);
router.get("/:id", getSingleBlog);

router.get("/", getAllBlogs);

module.exports = router;
