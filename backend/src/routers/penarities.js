import express from "express";
import {
  createPenalty,
  getAllPenalties,
  getPenaltyById,
  getPenaltiesByUser, // New function
  updatePenalty,
  getAllPenaltiesUser,
  deletePenalty,
  getPenaltiesByUserId,
  updatePenaltyStatus,
  payPenalty,
  getPenalties,
  fixedCheckout
} from "../controllers/penaltyController.js";

import { protect } from "../middlewares/protect.js";

const router = express.Router();

// Routes

router.put("/update/status/:id", protect, updatePenaltyStatus);
router.get("/bylocation", protect,getPenalties); // Get all penalties
router.get("/", protect,getAllPenalties); // Get all penalties
router.get("/mypenarities",protect, getPenaltiesByUserId); // Get a penalty by ID
router.get("/", protect,getAllPenaltiesUser); // Get penalties for a specific user
router.post("/add", protect, createPenalty); // Create a new penalty
router.delete("/delete/:id", protect, deletePenalty); // Delete a penalty
router.post("/pay", protect, payPenalty);
router.post("/checkout", protect, fixedCheckout);

export default router;
