const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { submitRating } = require("../controllers/ratingController");

router.post("/", authenticate, authorize("USER"), submitRating);

module.exports = router;