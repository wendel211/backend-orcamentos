import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createItem,
    listItems
} from "../controllers/items.controller.js";

const router = express.Router();

router.post("/", asyncHandler(createItem));
router.get("/:budgetId", asyncHandler(listItems));

export default router;
