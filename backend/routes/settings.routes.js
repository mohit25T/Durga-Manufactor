import express from "express";
import { getSetting, updateSetting } from "../controllers/settings.controller.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route to fetch settings (e.g. for frontend sorting)
router.get("/:key", getSetting);

// Admin-only route to update settings
router.put("/:key", verifyAdmin, updateSetting);

export default router;
