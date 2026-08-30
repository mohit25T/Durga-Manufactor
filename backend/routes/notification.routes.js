import express from "express";
import { sendNotification, updateDealerFcmToken } from "../controllers/notification.controller.js";
import { verifyDealer } from "../middleware/dealer.middleware.js";

const router = express.Router();

// Update FCM token for authenticated dealer
router.post("/fcm-token", verifyDealer, updateDealerFcmToken);
router.patch("/fcm-token", verifyDealer, updateDealerFcmToken);

// Send notification (direct/test)
router.post("/send", sendNotification);

export default router;
