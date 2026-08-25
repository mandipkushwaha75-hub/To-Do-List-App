const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "fallback_secret_key_todo_app_2026";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};

// Signup / Register handler helper
const handleSignup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const displayName = name || username;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        message: "Please provide name/username, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email address already exists",
      });
    }

    const user = await User.create({
      name: displayName,
      email,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// POST /signup and POST /register
router.post("/signup", handleSignup);
router.post("/register", handleSignup);

// ==========================================
// LOGIN USER
// POST /api/auth/login
// ==========================================
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// GET CURRENT USER PROFILE
// GET /api/auth/me
// ==========================================
router.get("/me", auth, async (req, res, next) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
