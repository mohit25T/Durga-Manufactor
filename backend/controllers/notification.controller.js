import { sendPushNotification } from "../services/notification.service.js";
import Dealer from "../models/Dealer.js";

/**
 * Send push notification to a specific FCM token
 */
export async function sendNotification(req, res) {
  try {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "token, title, and body are required",
      });
    }

    const response = await sendPushNotification(token, title, body, data || {});

    res.status(200).json({
      success: true,
      message: "Notification processing complete",
      result: response,
    });
  } catch (error) {
    console.error("Notification Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
}

/**
 * Update FCM token for authenticated dealer
 */
export async function updateDealerFcmToken(req, res) {
  try {
    const { fcmToken } = req.body;
    const dealerId = req.dealer?.id || req.user?.id;

    if (!dealerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Dealer ID not found in request",
      });
    }

    if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: "fcmToken is required",
      });
    }

    console.log(`📲 [BACKEND FCM SYNC] Updating FCM token for Dealer ID: ${dealerId}`);
    console.log(`   Token: ${fcmToken.slice(0, 20)}...`);

    const dealer = await Dealer.findByIdAndUpdate(
      dealerId,
      { fcmToken },
      { new: true }
    );

    if (!dealer) {
      console.warn(`⚠️ [BACKEND FCM SYNC FAILED] Dealer ID ${dealerId} not found in DB`);
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    console.log(`✅ [BACKEND FCM SYNC SUCCESS] Token stored in DB for Dealer (${dealer.companyName || dealer.contactPerson})`);

    res.status(200).json({
      success: true,
      message: "FCM token updated successfully",
      fcmToken: dealer.fcmToken,
    });
  } catch (error) {
    console.error("Update FCM Token Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update FCM token",
      error: error.message,
    });
  }
}
