const {
  cloudinaryImageUpload,
  cloudinaryDeleteImages,
} = require("../helpers/Cloudinary");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const uploadProductImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryImageUpload(path, "images");
    const urls = [];
    const files = req.files;
    for (let file of files) {
      const { path } = file;
      let newPath = await uploader(path);
      urls.push(newPath);
      // fs.unlinkSync(path);
    }
    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProductImages = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    cloudinaryDeleteImages(id, "images");
    res.json({ message: "Images deleted", success: true });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { uploadProductImages, deleteProductImages };
