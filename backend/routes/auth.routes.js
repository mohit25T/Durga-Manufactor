import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

/*
  @route   POST /api/auth/login
  @desc    Admin login
  @access  Public
*/
router.post("/login", loginAdmin);

export default router;