import express from "express";
import { register, login } from "../controllers/user.controller.js";
import { checkApiKey } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public auth routes (but still protected by API Key)
router.post("/register", checkApiKey, register);
router.post("/login", checkApiKey, login);

export default router;
