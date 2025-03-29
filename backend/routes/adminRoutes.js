const express = require("express");
const router = express.Router();
const { addAdmin, getAdmins } = require("../controllers/adminController");

// Route to add a new admin
router.post("/add", addAdmin);

// Route to get all admins
router.get("/", getAdmins);

module.exports = router;
