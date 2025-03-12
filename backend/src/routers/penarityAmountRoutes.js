import express from "express";
import { getPenarityAmount, updatePenarityAmount } from "../controllers/penarityAmountController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.get("/", protect,getPenarityAmount);
router.put("/update", protect, updatePenarityAmount);

export default router;
