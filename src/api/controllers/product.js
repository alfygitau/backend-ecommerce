const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const slugify = require("slugify");
const User = require("../models/User");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    let newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleProduct = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    let product = await Product.findById(id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    let queryObject = { ...req.query };
    // filtering
    let excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);
    let query = Product.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      let sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields
    if (req.query.fields) {
      let fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    let page = req.query.page;
    let limit = req.query.limit;
    let skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      let productsCount = await Product.countDocuments();
      if (skip >= productsCount) throw new Error("This page does not exist");
    }

    let products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { title } = req.query;
    console.log(req.query)
    let result = await Product.find({title: { $regex: title, $options: "i" }});
    res.json(result)
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    let updatedProduct = await Product.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    let deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  let { _id } = req.user;
  let { prodId } = req.body;
  let user = await User.findById(_id);
  let alreadyAdded = user.wishlist.find(
    (id) => id.toString() === prodId.toString()
  );
  if (alreadyAdded) {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: prodId },
      },
      { new: true }
    );
    res.json(user);
  } else {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: prodId },
      },
      { new: true }
    );
    res.json(user);
  }
  try {
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  let { star, prodId, comment } = req.body;
  try {
    let product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (rate) => rate.postedBy.toString() === _id.toString()
    );
    if (alreadyRated) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: { ratings: { star: star, postedBy: _id, comment: comment } },
        },
        { new: true }
      );
    }
    let foundProduct = await Product.findById(prodId);
    let totalRatings = foundProduct.ratings.length;
    let ratingSum = foundProduct.ratings
      .map((item) => item.star)
      .reduce((acc, cv) => acc + cv, 0);
    let resultRating = Math.round(ratingSum / totalRatings);
    let updatedProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalratings: resultRating,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  searchProducts,
};
