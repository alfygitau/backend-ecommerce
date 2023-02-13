const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");

const createBrand = asyncHandler(async (req, res) => {
  try {
    let newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let updatedBrand = await Brand.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let brand = await Brand.findById(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});


const getBrands = asyncHandler(async (req, res) => {
  try {
    let brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands
};
