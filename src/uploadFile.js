const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

let multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(path.resolve(__dirname, "images"));
    cb(null, path.resolve(__dirname, "images"));
  },
  filename: function (req, file, cb) {
    let uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileExtension = path.extname(file.originalname).split(".")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + fileExtension);
  },
});

let multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format or type",
      },
      false
    );
  }
};

let uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 4000000 },
});

const resizeProductImages = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`images/products/${file.filename}`);
      fs.unlinkSync(`images/products/${file.filename}`);
    })
  );
  next();
};
const resizeBlogImages = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`images/blogs/${file.filename}`);
      fs.unlinkSync(`images/blogs/${file.filename}`);
    })
  );
  next();
};

module.exports = { uploadImage, resizeBlogImages, resizeProductImages };
