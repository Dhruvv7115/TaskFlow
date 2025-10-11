// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
	let token;

	// Check for token in Authorization header
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || "your_jwt_secret_key_change_this",
			);

			// Get user from token (exclude password)
			req.user = await User.findById(decoded.id).select("-password");

			if (!req.user) {
				return res.status(401).json({
					success: false,
					message: "User not found",
				});
			}

			next();
		} catch (error) {
			console.error("Auth Middleware Error:", error);
			return res.status(403).json({
				success: false,
				message: "Forbidden: Invalid or expired token",
			});
		}
	}

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Not authorized, no token",
		});
	}
};

module.exports = { protect };
