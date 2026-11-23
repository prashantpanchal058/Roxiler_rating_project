const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { getStores } = require("../controllers/userController");
const { getOwnerDashboard } = require("../controllers/storeController");

router.get("/stores", authenticate, authorize("USER"), getStores);
router.get("/owner/dashboard", authenticate, authorize("OWNER"), getOwnerDashboard);

module.exports = router;