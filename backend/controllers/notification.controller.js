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

/**
 * Remove FCM token on logout (Dealer or Admin)
 */
export async function removeFcmToken(req, res) {
  try {
    const { fcmToken } = req.body;
    const userId = req.dealer?.id || req.user?.id;

    if (userId) {
      // Check Dealer
      const dealer = await Dealer.findById(userId);
      if (dealer) {
        dealer.fcmToken = "";
        dealer.activeSession = { deviceId: "", deviceName: "", sessionToken: "", loggedInAt: null };
        await dealer.save();
        console.log(`📱 [FCM TOKEN CLEARED] Cleared FCM token & session for Dealer ${dealer.companyName}`);
      }

      // Check Admin
      const Admin = (await import("../models/Admin.js")).default;
      const adminDoc = await Admin.findById(userId);
      if (adminDoc && fcmToken) {
        adminDoc.fcmTokens = (adminDoc.fcmTokens || []).filter((t) => t !== fcmToken);
        await adminDoc.save();
        console.log(`📱 [FCM TOKEN CLEARED] Removed FCM token for Admin ${adminDoc.email}`);
      }
    } else if (fcmToken) {
      await Dealer.updateMany({ fcmToken }, { $set: { fcmToken: "", "activeSession.deviceId": "" } });
      const Admin = (await import("../models/Admin.js")).default;
      await Admin.updateMany({}, { $pull: { fcmTokens: fcmToken } });
      console.log(`📱 [FCM TOKEN CLEARED] Unregistered token from database on logout.`);
    }

    return res.status(200).json({
      success: true,
      message: "FCM token removed successfully"
    });
  } catch (error) {
    console.error("Remove FCM Token Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove FCM token",
      error: error.message
    });
  }
}
