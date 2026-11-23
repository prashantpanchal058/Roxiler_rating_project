const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    validateName,
    validateAddress,
    validateEmail,
    validatePassword
} = require("../utils/validators");

const signup = async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!validateName(name) ||
            !validateAddress(address) ||
            !validateEmail(email) ||
            !validatePassword(password)) {
            return res.status(400).json({
                message: "Invalid input details"
            });
        }
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, address, password, role)
             VALUES ($1, $2, $3, $4, 'USER')
             RETURNING id, name, email, address, role`,
            [name, email, address, hashedPassword]
        );
        
        res.status(201).json({
            message: "Registration successful",
            user: result.rows[0]
        });

    }  catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters, contain an uppercase letter and a special character"
            });
        }

        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [req.user.id]
        );

        const validPassword = await bcrypt.compare(
            currentPassword,
            result.rows[0].password
        );

        if (!validPassword) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, req.user.id]
        );

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    signup,
    login,
    updatePassword
};