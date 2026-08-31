import admin, { firebaseInitialized } from "../config/firebase.js";

/**
 * Send push notification to a SINGLE device token
 */
export async function sendPushNotification(token, title, body, data = {}) {
  if (!token) {
    console.log("⚠️ No FCM token provided for notification");
    return null;
  }

  if (!firebaseInitialized) {
    console.warn("⚠️ Firebase is not initialized. Skipping push notification.");
    return null;
  }

  const stringifiedData = {};
  Object.keys(data).forEach((key) => {
    stringifiedData[key] = String(data[key] ?? "");
  });

  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: {
      ...stringifiedData,
      click_action: "FLUTTER_NOTIFICATION_CLICK",
    },
    android: {
      priority: "high",
      notification: {
        channelId: "default_channel",
        sound: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ FCM push notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("🔥 FCM PUSH NOTIFICATION ERROR:", error);
    return null;
  }
}

/**
 * Send push notification to MULTIPLE device tokens
 */
export async function sendPushNotificationToMany(
  tokens = [],
  title,
  body,
  data = {},
  sound = "default"
) {
  const uniqueTokens = [...new Set(tokens)].filter(Boolean);

  if (uniqueTokens.length === 0) {
    console.log("⚠️ No valid FCM tokens found");
    return null;
  }

  if (!firebaseInitialized) {
    console.warn("⚠️ Firebase is not initialized. Skipping multicast push notification.");
    return null;
  }

  const stringifiedData = {};
  Object.keys(data).forEach((key) => {
    stringifiedData[key] = String(data[key] ?? "");
  });

  const message = {
    tokens: uniqueTokens,
    notification: {
      title,
      body,
    },
    data: {
      ...stringifiedData,
      click_action: "FLUTTER_NOTIFICATION_CLICK",
    },
    android: {
      priority: "high",
      notification: {
        channelId: sound === "default" ? "default_channel" : "sos_channel",
        sound: sound === "default" ? "default" : sound,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: sound === "default" ? "default" : `${sound}.mp3`,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("✅ FCM multicast response:", {
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
    return response;
  } catch (error) {
    console.error("🔥 FCM MULTICAST ERROR:", error);
    return null;
  }
}

/**
 * Helper to save notification in DB and dispatch FCM push notification to dealer
 */
export async function createAndSendDealerNotification({
  dealerId,
  orderId = null,
  title,
  message,
  type = "status_update",
  data = {}
}) {
  try {
    const DealerNotification = (await import("../models/DealerNotification.js")).default;
    const Dealer = (await import("../models/Dealer.js")).default;

    const notif = await DealerNotification.create({
      dealer: dealerId,
      order: orderId,
      title,
      message,
      type
    });

    const dealer = await Dealer.findById(dealerId);

    console.log(`\n🔔 ==================== NOTIFICATION DISPATCHED ====================`);
    console.log(`📌 RECIPIENT DEALER ID : ${dealerId} (${dealer?.companyName || "Dealer"})`);
    console.log(`📌 TITLE               : ${title}`);
    console.log(`📌 MESSAGE             : ${message}`);
    console.log(`📌 TYPE                : ${type}`);
    if (dealer && dealer.fcmToken) {
      console.log(`📱 FCM TOKEN           : ${dealer.fcmToken.substring(0, 20)}...`);
      await sendPushNotification(dealer.fcmToken, title, message, {
        ...data,
        type,
        notificationId: notif._id.toString(),
        orderId: orderId ? orderId.toString() : "",
      });
    } else {
      console.log(`⚠️ FCM TOKEN STATUS     : No FCM token registered for dealer ${dealerId} yet.`);
    }
    console.log(`========================================================================\n`);

    return notif;
  } catch (error) {
    console.error("Error creating/sending dealer notification:", error);
  }
}

/**
 * Helper to dispatch FCM push notification to ALL logged-in Admin devices
 */
export async function createAndSendAdminNotification({
  orderId = null,
  title,
  message,
  type = "admin_alert",
  data = {}
}) {
  try {
    const Admin = (await import("../models/Admin.js")).default;
    const Dealer = (await import("../models/Dealer.js")).default;

    // Collect FCM tokens across all Admin accounts
    const admins = await Admin.find({});
    let adminTokens = [];

    admins.forEach((adminDoc) => {
      if (Array.isArray(adminDoc.fcmTokens)) {
        adminTokens.push(...adminDoc.fcmTokens);
      }
    });

    // Also check any Dealer documents marked with role: 'admin'
    const adminDealers = await Dealer.find({ role: "admin" });
    adminDealers.forEach((d) => {
      if (d.fcmToken) adminTokens.push(d.fcmToken);
    });

    adminTokens = [...new Set(adminTokens)].filter(Boolean);

    console.log(`\n🔔 ==================== ADMIN NOTIFICATION DISPATCHED ====================`);
    console.log(`📌 RECIPIENT           : ALL ADMIN DEVICES (${adminTokens.length} active tokens)`);
    console.log(`📌 TITLE               : ${title}`);
    console.log(`📌 MESSAGE             : ${message}`);
    console.log(`📌 TYPE                : ${type}`);

    if (adminTokens.length > 0) {
      await sendPushNotificationToMany(adminTokens, title, message, {
        ...data,
        type,
        orderId: orderId ? orderId.toString() : "",
      });
    } else {
      console.log(`⚠️ FCM TOKEN STATUS     : No active Admin FCM tokens found.`);
    }
    console.log(`========================================================================\n`);

    return true;
  } catch (error) {
    console.error("Error creating/sending admin notification:", error);
  }
}

