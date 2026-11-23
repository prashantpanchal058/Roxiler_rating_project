const pool = require("../config/db");
const bcrypt = require("bcrypt");

const {
    validateName,
    validateAddress,
    validateEmail,
    validatePassword
} = require("../utils/validators");

const getDashboard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM stores) AS total_stores,
                (SELECT COUNT(*) FROM ratings) AS total_ratings
        `);

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body;

        if (!validateName(name) ||
            !validateAddress(address) ||
            !validateEmail(email) ||
            !validatePassword(password) ||
            !["ADMIN", "USER", "OWNER"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user details"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, address, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, address, role`,
            [name, email, address, hashedPassword, role]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

        const allowedSort = ["name", "email", "address", "role"];
        const sortColumn = allowedSort.includes(sortBy) ? sortBy : "name";
        const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        const result = await pool.query(
            `SELECT id, name, email, address, role
             FROM users
             WHERE name ILIKE $1
             AND email ILIKE $2
             AND address ILIKE $3
             AND role ILIKE $4
             ORDER BY ${sortColumn} ${sortOrder}`,
            [
                `%${name || ""}%`,
                `%${email || ""}%`,
                `%${address || ""}%`,
                `%${role || ""}%`
            ]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email, u.address, u.role,
             CASE WHEN u.role = 'OWNER' THEN
                (SELECT COALESCE(AVG(r.rating), 0)
                 FROM stores s
                 LEFT JOIN ratings r ON r.store_id = s.id
                 WHERE s.owner_id = u.id)
             ELSE NULL END AS rating
             FROM users u
             WHERE u.id = $1`,
            [req.params.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getDashboard,
    createUser,
    getUsers,
    getUserById
};