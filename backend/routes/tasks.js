// routes/tasks.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { protect } = require("../middleware/auth");
const Task = require("../models/Task");

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user (with search & filter)
// @access  Private
router.get("/", protect, async (req, res) => {
	try {
		const { search, status, priority, sort } = req.query;

		// Build query
		const query = { userId: req.user.id };

		// Search by title or description
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		// Filter by status
		if (status) {
			query.status = status;
		}

		// Filter by priority
		if (priority) {
			query.priority = priority;
		}

		// Sort options
		let sortOption = { createdAt: -1 }; // Default: newest first
		if (sort === "oldest") sortOption = { createdAt: 1 };
		if (sort === "title") sortOption = { title: 1 };
		if (sort === "priority") sortOption = { priority: -1 };

		const tasks = await Task.find(query).sort(sortOption);

		res.status(200).json({
			success: true,
			count: tasks.length,
			data: tasks,
		});
	} catch (error) {
		console.error("Get Tasks Error:", error);
		res.status(500).json({
			success: false,
			message: "Server error fetching tasks",
		});
	}
});

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			userId: req.user.id,
		});

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		res.status(200).json({
			success: true,
			data: task,
		});
	} catch (error) {
		console.error("Get Task Error:", error);
		res.status(500).json({
			success: false,
			message: "Server error fetching task",
		});
	}
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
	"/",
	[
		protect,
		body("title")
			.trim()
			.notEmpty()
			.withMessage("Title is required")
			.isLength({ max: 100 })
			.withMessage("Title cannot exceed 100 characters"),
		body("description")
			.optional()
			.trim()
			.isLength({ max: 500 })
			.withMessage("Description cannot exceed 500 characters"),
		body("status")
			.optional()
			.isIn(["pending", "in-progress", "completed"])
			.withMessage("Status must be pending, in-progress, or completed"),
		body("priority")
			.optional()
			.isIn(["low", "medium", "high"])
			.withMessage("Priority must be low, medium, or high"),
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

			const { title, description, status, priority } = req.body;

			const task = await Task.create({
				title,
				description,
				status,
				priority,
				userId: req.user.id,
			});

			res.status(201).json({
				success: true,
				message: "Task created successfully",
				data: task,
			});
		} catch (error) {
			console.error("Create Task Error:", error);
			res.status(500).json({
				success: false,
				message: "Server error creating task",
			});
		}
	},
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
	"/:id",
	[
		protect,
		body("title")
			.optional()
			.trim()
			.notEmpty()
			.withMessage("Title cannot be empty")
			.isLength({ max: 100 })
			.withMessage("Title cannot exceed 100 characters"),
		body("description")
			.optional()
			.trim()
			.isLength({ max: 500 })
			.withMessage("Description cannot exceed 500 characters"),
		body("status")
			.optional()
			.isIn(["pending", "in-progress", "completed"])
			.withMessage("Status must be pending, in-progress, or completed"),
		body("priority")
			.optional()
			.isIn(["low", "medium", "high"])
			.withMessage("Priority must be low, medium, or high"),
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

			const { title, description, status, priority } = req.body;

			let task = await Task.findOne({
				_id: req.params.id,
				userId: req.user.id,
			});

			if (!task) {
				return res.status(404).json({
					success: false,
					message: "Task not found",
				});
			}

			// Update fields
			if (title !== undefined) task.title = title;
			if (description !== undefined) task.description = description;
			if (status !== undefined) task.status = status;
			if (priority !== undefined) task.priority = priority;

			await task.save();

			res.status(200).json({
				success: true,
				message: "Task updated successfully",
				data: task,
			});
		} catch (error) {
			console.error("Update Task Error:", error);
			res.status(500).json({
				success: false,
				message: "Server error updating task",
			});
		}
	},
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete("/:id", protect, async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			userId: req.user.id,
		});

		if (!task) {
			return res.status(404).json({
				success: false,
				message: "Task not found",
			});
		}

		await Task.deleteOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			message: "Task deleted successfully",
		});
	} catch (error) {
		console.error("Delete Task Error:", error);
		res.status(500).json({
			success: false,
			message: "Server error deleting task",
		});
	}
});

// @route   DELETE /api/tasks/batch
// @desc    Delete multiple tasks
// @access  Private
router.delete("/batch", protect, async (req, res) => {
	try {
		const { taskIds } = req.body;
		const result = await Task.deleteMany({
			_id: { $in: taskIds },
			userId: req.userId,
		});
		res.json({
			message: `${result.deletedCount} tasks deleted successfully`,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// routes/tasks.js
router.get("/stats", protect, async (req, res) => {
	try {
		const stats = await Task.aggregate([
			{ $match: { userId: mongoose.Types.ObjectId(req.userId) } },
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		const total = await Task.countDocuments({ userId: req.userId });

		res.json({
			total,
			byStatus: stats,
			recentTasks: await Task.find({ userId: req.userId })
				.sort("-createdAt")
				.limit(5),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
