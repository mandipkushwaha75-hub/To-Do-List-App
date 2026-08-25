const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Apply JWT authentication middleware to all task routes
router.use(auth);

// ==========================================
// CREATE TASK
// POST /api/tasks
// ==========================================
router.post("/", async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        message: "Title cannot be more than 100 characters",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      isCompleted: Boolean(isCompleted),
      dueDate: dueDate || null,
      user: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// READ ALL TASKS (FOR AUTHENTICATED USER)
// GET /api/tasks
// GET /api/tasks?completed=true
// ==========================================
router.get("/", async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.completed !== undefined) {
      if (
        req.query.completed !== "true" &&
        req.query.completed !== "false"
      ) {
        return res.status(400).json({
          message: "completed query must be true or false",
        });
      }

      filter.isCompleted = req.query.completed === "true";
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// READ INDIVIDUAL TASK
// GET /api/tasks/:id
// ==========================================
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// UPDATE TASK
// PATCH /api/tasks/:id
// ==========================================
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const allowedFields = ["title", "description", "isCompleted", "dueDate"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined) {
      if (typeof updates.title !== "string" || !updates.title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty",
        });
      }

      if (updates.title.trim().length > 100) {
        return res.status(400).json({
          message: "Title cannot be more than 100 characters",
        });
      }
      updates.title = updates.title.trim();
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// DELETE TASK
// DELETE /api/tasks/:id
// ==========================================
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      id: id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
