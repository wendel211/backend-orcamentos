import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createBudget,
    listBudgets,
    getBudget,
    deleteBudget
} from "../controllers/budgets.controller.js";

const router = express.Router();

router.post("/", asyncHandler(createBudget));
router.get("/", asyncHandler(listBudgets));
router.get("/:id", asyncHandler(getBudget));
router.delete("/:id", asyncHandler(deleteBudget));

export default router;
