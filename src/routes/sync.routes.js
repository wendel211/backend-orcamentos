import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { syncPush, syncPull } from "../controllers/sync.controller.js";

const router = express.Router();

router.post("/push", asyncHandler(syncPush));
router.get("/pull", asyncHandler(syncPull));

export default router;
