
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const { eventBus } = require("../events/eventBus");
const { ObjectId } = require("mongodb");

// Generate JWT Token
function generateToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
}

// USER SIGNUP
async function signup(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const users = getDB().collection("users");

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await users.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
            createdAt: new Date()
        };

        const result = await users.insertOne(newUser);

        eventBus.emit("user:registered", {
            email: normalizedEmail
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: result.insertedId,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Signup Error:", error.message);

        res.status(500).json({
            message: "Server error during signup"
        });
    }
}

// USER LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await getDB()
            .collection("users")
            .findOne({
                email: email.trim().toLowerCase()
            });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = generateToken(user);

        eventBus.emit("user:loggedIn", {
            email: user.email
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);

        res.status(500).json({
            message: "Server error during login"
        });
    }
}

// GET USER PROFILE
async function getProfile(req, res) {
    try {
        const user = await getDB()
            .collection("users")
            .findOne(
                { _id: new ObjectId(req.user.id) },
                { projection: { password: 0 } }
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
}

module.exports = {
    signup,
    login,
    getProfile
};
