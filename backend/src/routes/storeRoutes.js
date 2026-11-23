const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createStore,
    getStores
} = require("../controllers/storeController");

router.get("/", authenticate, getStores);
router.post("/", authenticate, authorize("ADMIN"), createStore);

module.exports = router;