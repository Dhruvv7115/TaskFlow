const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/user", require("./routes/user.js"));
app.use("/api/tasks", require("./routes/tasks.js"));

// Health check
app.get("/", (req, res) => {
  console.log("Health check endpoint hit");
	res.json({ message: "Backend API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
});



// MongoDB Connection
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/internship-app",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	)
	.then(() => console.log("✅ MongoDB Connected"))
	.then(() =>
		app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`)),
	)
	.catch((err) => console.error("❌ MongoDB Connection Error:", err));

