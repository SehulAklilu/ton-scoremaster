const express = require("express");
const { authenticateUser, login } = require("../controllers/authController");

const router = express.Router();

router.post("/auth", authenticateUser);
router.post("/login", login);

module.exports = router;
