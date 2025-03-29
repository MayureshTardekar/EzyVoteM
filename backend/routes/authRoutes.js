const express = require("express");
const router = express.Router();
const { registerUser, walletLogin } = require("../controllers/authController");

// Route to register a new user
router.post("/register", registerUser);

// Route for wallet login (for both admin and user)
router.post("/wallet-login", walletLogin);

module.exports = router;
