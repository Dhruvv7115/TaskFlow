// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign(
		{ id },
		process.env.JWT_SECRET || "your_jwt_secret_key_change_this",
		{
			expiresIn: "30d",
		},
	);
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
	"/register",
	[
		body("name")
			.trim()
			.isLength({ min: 2 })
			.withMessage("Name must be at least 2 characters"),
		body("email")
			.isEmail()
			.normalizeEmail()
			.withMessage("Please provide a valid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	async (req, res) => {
		try {
			// Validate input
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: errors.array(),
				});
			}

			const { name, email, password } = req.body;

			// Check if user already exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "User with this email already exists",
				});
			}

			// Create new user
			const user = await User.create({
				name,
				email,
				password,
			});

			// Generate token
			const token = generateToken(user._id);

			res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: {
					id: user?._id,
					name: user?.name,
					email: user?.email,
					createdAt: user?.createdAt,
					token,
				},
			});
		} catch (error) {
			console.error("Register Error:", error);
			res.status(500).json({
				success: false,
				message: "Server error during registration",
			});
		}
	},
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
	"/login",
	[
		body("email")
			.isEmail()
			.normalizeEmail()
			.withMessage("Please provide a valid email"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	async (req, res) => {
		try {
			// Validate input
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: errors.array(),
				});
			}

			const { email, password } = req.body;

			// Find user and include password field
			const user = await User.findOne({ email }).select("+password");

			if (!user) {
				return res.status(401).json({
					success: false,
					message: "Invalid email or password",
				});
			}

			// Check password
			const isPasswordValid = await user.comparePassword(password);

			if (!isPasswordValid) {
				return res.status(401).json({
					success: false,
					message: "Invalid email or password",
				});
			}

			// Generate token
			const token = generateToken(user._id);

			res.status(200).json({
				success: true,
				message: "Login successful",
				data: {
					id: user?._id,
					name: user?.name,
					email: user?.email,
					createdAt: user?.createdAt,
					token,
				},
			});
		} catch (error) {
			console.error("Login Error:", error);
			res.status(500).json({
				success: false,
				message: "Server error during login",
			});
		}
	},
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Protected
router.post("/logout", protect, (req, res) => {
	jwt;
	try {
		res.status(200).json({
			success: true,
			message: "Logout successful",
		});
	} catch (error) {
		console.error("Logout Error:", error);
		res.status(500).json({
			success: false,
			message: "Server error during logout",
		});
	}
});

module.exports = router;
