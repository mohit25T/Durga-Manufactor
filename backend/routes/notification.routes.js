import express from "express";
import { sendNotification, updateDealerFcmToken, removeFcmToken } from "../controllers/notification.controller.js";
import { verifyDealer } from "../middleware/dealer.middleware.js";

const router = express.Router();

// Update / Remove FCM token
router.post("/fcm-token", verifyDealer, updateDealerFcmToken);
router.patch("/fcm-token", verifyDealer, updateDealerFcmToken);
router.post("/fcm-token/remove", removeFcmToken);

// Send notification (direct/test)
router.post("/send", sendNotification);

export default router;
