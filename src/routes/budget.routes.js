import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateBudget, deleteBudget, getBudget } from "../controllers/budget.controller.js";

const router = express.Router();

router.get("/:id", asyncHandler(getBudget));
router.put("/:id", asyncHandler(updateBudget));
router.delete("/:id", asyncHandler(deleteBudget));

export default router;
