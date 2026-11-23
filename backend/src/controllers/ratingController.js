const pool = require("../config/db");

const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, store_id)
             DO UPDATE SET rating = EXCLUDED.rating,
                           updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [req.user.id, store_id, rating]
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { submitRating };