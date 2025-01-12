import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get current user
router.get("/me", authMiddleware, getMe);

// Logout
router.post("/logout", logoutUser);

export default router;
