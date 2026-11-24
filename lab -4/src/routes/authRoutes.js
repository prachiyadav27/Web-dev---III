const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    getProfile
} = require("../controllers/authController");

const {
    authenticateToken
} = require("../middleware/auth");

router.post("/signup", signup);

router.post("/login", login);

router.get("/me", authenticateToken, getProfile);

module.exports = router;
