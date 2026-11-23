const pool = require("../config/db");

const createStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        const result = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, email, address, owner_id || null]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = "name",
            order = "ASC"
        } = req.query;

        const allowedSort = ["name", "email", "address"];
        const sortColumn = allowedSort.includes(sortBy) ? sortBy : "name";
        const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        const result = await pool.query(
            `SELECT s.id, s.name, s.email, s.address,
                COALESCE(AVG(r.rating), 0) AS overall_rating
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.name ILIKE $1
             AND s.email ILIKE $2
             AND s.address ILIKE $3
             GROUP BY s.id
             ORDER BY s.${sortColumn} ${sortOrder}`,
            [
                `%${name || ""}%`,
                `%${email || ""}%`,
                `%${address || ""}%`
            ]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getOwnerDashboard = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.id AS store_id, s.name AS store_name,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS total_ratings
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.owner_id = $1
             GROUP BY s.id`,
            [req.user.id]
        );

        const ratings = await pool.query(
            `SELECT u.name, u.email, r.rating, r.updated_at
             FROM ratings r
             JOIN users u ON u.id = r.user_id
             JOIN stores s ON s.id = r.store_id
             WHERE s.owner_id = $1
             ORDER BY r.updated_at DESC`,
            [req.user.id]
        );

        res.json({
            stores: result.rows,
            submittedRatings: ratings.rows
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createStore,
    getStores,
    getOwnerDashboard
};