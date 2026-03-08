import express from "express";
import { createLead, getLeads } from "../controllers/lead.controller.js";

const router = express.Router();

// Create new inquiry
router.post("/", createLead);

// Get all inquiries (admin)
router.get("/", getLeads);

export default router;