const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const taskRoutes = require("./routes/TaskRoute");
const authRoutes = require("./routes/AuthRoute");

const app = express();

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task REST API is running cleanly",
    status: "online",
  });
});

// ==========================================
// ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ==========================================
// 404 ROUTE HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// Must be placed after all routes
// ==========================================
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid data format",
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: "An account with this email address already exists",
    });
  }

  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// ==========================================
// DATABASE CONNECTION AND SERVER START
// ==========================================
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://localhost:27017/todo_db";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB at", MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
