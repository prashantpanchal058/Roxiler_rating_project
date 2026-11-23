const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getDashboard,
    createUser,
    getUsers,
    getUserById
} = require("../controllers/adminController");

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getDashboard);
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

module.exports = router;