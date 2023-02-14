const express = require("express");
const {
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactMessage,
  getContactMessages,
} = require("../controllers/contact");

const router = express.Router();

router.post("/", createContactMessage);
router.put("/:id", updateContactMessage);
router.delete("/:id", deleteContactMessage);
router.get("/:id", getContactMessage);

router.get("/", getContactMessages);

module.exports = router;
