const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");

const createContactMessage = asyncHandler(async (req, res) => {
  try {
    let newContactMessage = await Contact.create(req.body);
    res.json(newContactMessage);
  } catch (error) {
    throw new Error(error);
  }
});

const updateContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let updatedContactMessage = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedContactMessage);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let deletedContactMessage = await Contact.findByIdAndDelete(id);
    res.json(deletedContactMessage);
  } catch (error) {
    throw new Error(error);
  }
});

const getContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let contactMessage = await Contact.findById(id);
    res.json(contactMessage);
  } catch (error) {
    throw new Error(error);
  }
});

const getContactMessages = asyncHandler(async (req, res) => {
  try {
    let contactMessages = await Contact.find({});
    res.json(contactMessages);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactMessage,
  getContactMessages,
};
