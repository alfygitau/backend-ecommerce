const mongoose = require("mongoose");

const validateMongoId = (id) => {
  let isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This is not valid mongo Id or not found");
};

module.exports = validateMongoId;
