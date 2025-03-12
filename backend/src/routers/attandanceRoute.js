import express from "express";
import {
  markAttendance,
  getAllAttendances,
  getAttendanceById,
  deleteAttendance,
  
} from "../controllers/attandanceController.js";

import { protect } from "../middlewares/protect.js"; // Middleware for authentication

const router = express.Router();

// Routes
router.get("/", protect,getAllAttendances); // Get all attendance records with user and post details
router.get("/:id",protect, getAttendanceById); // Get a single attendance record by ID
router.post("/add", protect, markAttendance); // Mark attendance (protected route)
router.delete("/:id", protect, deleteAttendance); // Delete attendance (protected)

export default router;
