const asyncHandler = require("express-async-handler");
const Color = require("../models/Color");

const createColor = asyncHandler(async (req, res) => {
  try {
    let newColor = await Color.create(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let updatedColor = await Color.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let deletedColor = await Color.findByIdAndDelete(id);
    res.json(deletedColor);
  } catch (error) {
    throw new Error(error);
  }
});

const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let color = await Color.findById(id);
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});


const getColors = asyncHandler(async (req, res) => {
  try {
    let colors = await Color.find({});
    res.json(colors);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getColors
};
