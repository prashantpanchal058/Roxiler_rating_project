
const pool = require("../config/db");

const getStores = async (req, res) => {
    try {
        const { name, address, sortBy = "name", order = "ASC" } = req.query;

        const allowedSort = ["name", "address"];
        const sortColumn = allowedSort.includes(sortBy) ? sortBy : "name";
        const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        const result = await pool.query(
            `SELECT 
                s.id,
                s.name,
                s.address,
                COALESCE(AVG(r.rating), 0) AS overall_rating,
                MAX(CASE 
                    WHEN r.user_id = $3 THEN r.rating 
                END) AS user_rating
             FROM stores s
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.name ILIKE $1 
               AND s.address ILIKE $2
             GROUP BY s.id
             ORDER BY s.${sortColumn} ${sortOrder}`,
            [
                `%${name || ""}%`,
                `%${address || ""}%`,
                req.user.id
            ]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Get stores error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getStores };
