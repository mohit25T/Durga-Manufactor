import express from "express";
import { handleAiChat } from "../controllers/chat.controller.js";

const router = express.Router();

/*
  @route   POST /api/chat
  @desc    AI Chatbot interaction
  @access  Public
*/
router.post("/", handleAiChat);

export default router;
