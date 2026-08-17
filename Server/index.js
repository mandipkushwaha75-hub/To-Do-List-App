const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const taskRoutes = require("./routes/TaskRoute");

const app = express();


// ==========================================
// GLOBAL JSON MIDDLEWARE
// ==========================================
app.use(express.json());


// ==========================================
// HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task REST API is running",
  });
});


// ==========================================
// TASK ROUTES
// ==========================================
app.use("/api/tasks", taskRoutes);


// ==========================================
// 404 ROUTE
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
  console.error("Server error:", err.message);

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

  return res.status(500).json({
    message: "Internal Server Error",
  });
});


// ==========================================
// DATABASE CONNECTION AND SERVER START
// ==========================================
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
