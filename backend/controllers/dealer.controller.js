import Dealer from "../models/Dealer.js";
import Admin from "../models/Admin.js";
import DealerOrder from "../models/DealerOrder.js";
import DealerNotification from "../models/DealerNotification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendOrderStatusEmail } from "../utils/sendEmailNotification.js";
import { createAndSendDealerNotification } from "../services/notification.service.js";

// Dealer Register (Self Application)
export const registerDealer = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      password,
      phone,
      gstNumber,
      address,
      city,
      state
    } = req.body;

    if (!companyName || !contactPerson || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Company Name, Contact Person, Email, Password, and Phone are required."
      });
    }

    const existingDealer = await Dealer.findOne({ email: email.toLowerCase() });
    if (existingDealer) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const dealer = await Dealer.create({
      companyName,
      contactPerson,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      gstNumber: gstNumber || "",
      address: address || "",
      city: city || "",
      state: state || "",
      status: "pending",
      discountPercent: 10
    });

    return res.status(201).json({
      success: true,
      message: "Dealership application submitted! Your account is pending admin approval.",
      dealerId: dealer._id
    });
  } catch (error) {
    console.error("REGISTER DEALER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration."
    });
  }
};

// Dealer Login
export const loginDealer = async (req, res) => {
  try {
    const { email, password, deviceId, deviceName, forceLogin, fcmToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const dealer = await Dealer.findOne({ email: email.toLowerCase() });
    if (!dealer) {
      // Check if email belongs to Admin
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (admin) {
        const isAdminMatch = await bcrypt.compare(password, admin.password);
        if (isAdminMatch) {
          // Add Admin device FCM token to fcmTokens array
          if (fcmToken) {
            if (!Array.isArray(admin.fcmTokens)) admin.fcmTokens = [];
            if (!admin.fcmTokens.includes(fcmToken)) {
              admin.fcmTokens.push(fcmToken);
              await admin.save();
            }
          }

          const token = jwt.sign(
            {
              id: admin._id,
              email: admin.email,
              companyName: "Durga Admin",
              role: "admin"
            },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "7d" }
          );

          return res.status(200).json({
            success: true,
            message: "Admin Login Successful",
            token,
            role: "admin",
            dealer: {
              id: admin._id,
              companyName: "Durga Admin Portal",
              contactPerson: "System Administrator",
              email: admin.email,
              phone: "+91 94281 56213",
              gstNumber: "24AAAAA0000A1Z5",
              status: "approved",
              role: "admin",
              discountPercent: 0
            }
          });
        }
      }

      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await bcrypt.compare(password, dealer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    if (dealer.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your dealer application is currently pending Admin approval. You will receive access once approved."
      });
    }

    if (dealer.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your dealer account application was not approved. Please contact Durga Manufactor support."
      });
    }

    // Check Single Device Session enforcement for Dealers
    const existingDeviceId = dealer.activeSession?.deviceId;
    const existingDeviceName = dealer.activeSession?.deviceName || "another device";

    if (existingDeviceId && deviceId && existingDeviceId !== deviceId && !forceLogin) {
      return res.status(200).json({
        success: false,
        requiresConfirmation: true,
        activeDeviceName: existingDeviceName,
        message: `Your account is currently logged in on ${existingDeviceName}. Logging in on this device will automatically log out ${existingDeviceName}.`
      });
    }

    // Update active session and FCM token for current device
    if (deviceId || deviceName) {
      dealer.activeSession = {
        deviceId: deviceId || "",
        deviceName: deviceName || "Mobile Device",
        sessionToken: jwt.sign({ id: dealer._id, deviceId }, process.env.JWT_SECRET || "defaultsecret"),
        loggedInAt: new Date()
      };
    }

    if (fcmToken) {
      dealer.fcmToken = fcmToken;
    }

    await dealer.save();

    const token = jwt.sign(
      {
        id: dealer._id,
        email: dealer.email,
        companyName: dealer.companyName,
        role: "dealer"
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    const dealerData = dealer.toObject();
    delete dealerData.password;

    return res.status(200).json({
      success: true,
      message: "Dealer login successful.",
      token,
      dealer: dealerData
    });
  } catch (error) {
    console.error("DEALER LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during dealer login."
    });
  }
};

// Get current logged-in Dealer or Admin profile
export const getDealerProfile = async (req, res) => {
  try {
    if (req.dealer?.role === "admin") {
      const admin = await Admin.findById(req.dealer.id).select("-password");
      if (admin) {
        return res.status(200).json({
          success: true,
          dealer: {
            id: admin._id,
            companyName: "Durga Admin Portal",
            contactPerson: "System Administrator",
            email: admin.email,
            phone: "+91 94281 56213",
            gstNumber: "24AAAAA0000A1Z5",
            status: "approved",
            role: "admin",
            discountPercent: 0
          }
        });
      }
    }

    const dealer = await Dealer.findById(req.dealer.id).select("-password");
    if (!dealer) {
      // Fallback Admin check
      const admin = await Admin.findById(req.dealer.id).select("-password");
      if (admin) {
        return res.status(200).json({
          success: true,
          dealer: {
            id: admin._id,
            companyName: "Durga Admin Portal",
            contactPerson: "System Administrator",
            email: admin.email,
            phone: "+91 94281 56213",
            gstNumber: "24AAAAA0000A1Z5",
            status: "approved",
            role: "admin",
            discountPercent: 0
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: "Dealer account not found."
      });
    }
    return res.status(200).json({
      success: true,
      dealer
    });
  } catch (error) {
    console.error("GET DEALER PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching profile."
    });
  }
};

// Update Dealer profile
export const updateDealerProfile = async (req, res) => {
  try {
    const { companyName, contactPerson, phone, gstNumber, address, city, state } = req.body;

    let dealer = await Dealer.findById(req.dealer.id);
    if (!dealer) {
      const admin = await Admin.findById(req.dealer.id);
      if (admin) {
        if (contactPerson) admin.name = contactPerson;
        await admin.save();
        return res.status(200).json({
          success: true,
          message: "Admin profile updated successfully.",
          dealer: {
            id: admin._id,
            companyName: companyName || "Durga Admin Portal",
            contactPerson: admin.name || contactPerson || "System Administrator",
            email: admin.email,
            phone: phone || "+91 94281 56213",
            gstNumber: gstNumber || "24AAAAA0000A1Z5",
            status: "approved",
            role: "admin",
            address: address || "",
            city: city || "",
            state: state || "",
            discountPercent: 0
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: "Account not found."
      });
    }

    // GST & Company Details Locking Rule:
    // Once approved by admin (and GST number is set), dealer CANNOT change GST number or Company Name.
    const isApproved = dealer.status === "approved";
    const existingGST = (dealer.gstNumber || "").trim();

    if (isApproved && existingGST.length > 0) {
      if (gstNumber !== undefined && gstNumber.trim().toUpperCase() !== existingGST.toUpperCase()) {
        return res.status(403).json({
          success: false,
          message: "GST Number is locked after Admin approval and cannot be modified. Contact Durga Admin to request tax detail updates."
        });
      }
      if (companyName && companyName.trim() !== dealer.companyName.trim()) {
        return res.status(403).json({
          success: false,
          message: "Company Name is locked after Admin approval and cannot be modified. Contact Durga Admin to request profile updates."
        });
      }
    }

    // Allow adding/setting GST number for the first time or updating allowed details
    if (gstNumber !== undefined) {
      if (!isApproved || existingGST.length === 0) {
        dealer.gstNumber = gstNumber.trim().toUpperCase();
      }
    }
    if (companyName) {
      if (!isApproved || existingGST.length === 0) {
        dealer.companyName = companyName;
      }
    }

    if (contactPerson) dealer.contactPerson = contactPerson;
    if (phone) dealer.phone = phone;
    if (address !== undefined) dealer.address = address;
    if (city !== undefined) dealer.city = city;
    if (state !== undefined) dealer.state = state;

    await dealer.save();

    const updatedDealer = dealer.toObject();
    delete updatedDealer.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      dealer: updatedDealer
    });
  } catch (error) {
    console.error("UPDATE DEALER PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating profile."
    });
  }
};

// Dealer: Create bulk order / quotation request
export const createDealerOrder = async (req, res) => {
  try {
    const { items, notes, includeFullGst, billAmount, withoutBillAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required to place an order."
      });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.discountedPrice) || 0) * (Number(item.quantity) || 1),
      0
    );

    const isFullGst = includeFullGst !== false;
    let finalBillAmount = subtotal;
    let finalWithoutBillAmount = 0;
    let gstAmount = 0;

    if (isFullGst) {
      finalBillAmount = subtotal;
      finalWithoutBillAmount = 0;
      gstAmount = Math.round(subtotal * 0.18);
    } else {
      finalBillAmount = Number(billAmount) || 0;
      finalWithoutBillAmount = Number(withoutBillAmount) !== undefined
        ? Number(withoutBillAmount)
        : Math.max(0, subtotal - finalBillAmount);
      gstAmount = Math.round(finalBillAmount * 0.18);
    }

    const totalAmount = finalBillAmount + gstAmount + finalWithoutBillAmount;

    const order = await DealerOrder.create({
      dealer: req.dealer.id,
      items,
      subtotal,
      includeFullGst: isFullGst,
      billAmount: finalBillAmount,
      withoutBillAmount: finalWithoutBillAmount,
      gstAmount,
      totalAmount,
      status: "Pending",
      notes: notes || ""
    });

    // Create In-App & Push Notification for Dealer
    await createAndSendDealerNotification({
      dealerId: req.dealer.id,
      orderId: order._id,
      title: "Bulk Order / Quote Submitted",
      message: `Your machinery order #${order._id.toString().slice(-8).toUpperCase()} for ₹${totalAmount.toLocaleString("en-IN")} has been submitted successfully.`,
      type: "order_created"
    });

    // Trigger Email Notification (if configured)
    try {
      const dealerDoc = await Dealer.findById(req.dealer.id);
      if (dealerDoc && dealerDoc.email) {
        sendOrderStatusEmail({
          toEmail: dealerDoc.email,
          toName: dealerDoc.contactPerson || dealerDoc.companyName,
          orderId: order._id,
          status: "Pending",
          totalAmount: order.totalAmount,
          items: order.items
        }).catch((err) => console.error("Order creation email send error:", err));
      }
    } catch (e) {
      console.error("Email notification fetch error:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Order / Quotation request submitted successfully!",
      order
    });
  } catch (error) {
    console.error("CREATE DEALER ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating order."
    });
  }
};

// Dealer: Get my orders
export const getDealerOrders = async (req, res) => {
  try {
    const orders = await DealerOrder.find({ dealer: req.dealer.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("GET DEALER ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dealer orders."
    });
  }
};

// --- ADMIN CONTROLLERS FOR DEALERS ---

// Admin: Get all dealers
export const getAllDealersAdmin = async (req, res) => {
  try {
    const dealers = await Dealer.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      dealers
    });
  } catch (error) {
    console.error("ADMIN GET ALL DEALERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dealers list."
    });
  }
};

// Admin: Update dealer status or discount
export const updateDealerStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, discountPercent } = req.body;

    const dealer = await Dealer.findById(id);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found."
      });
    }

    if (status) dealer.status = status;
    if (discountPercent !== undefined) dealer.discountPercent = Number(discountPercent);

    await dealer.save();

    if (status === "approved") {
      await createAndSendDealerNotification({
        dealerId: dealer._id,
        title: "Dealership Account Approved!",
        message: "Congratulations! Your Durga Manufacturer authorized dealership account is now fully active.",
        type: "approval_update"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dealer account updated successfully.",
      dealer
    });
  } catch (error) {
    console.error("ADMIN UPDATE DEALER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating dealer status."
    });
  }
};

// Admin: Get all dealer orders
export const getAllDealerOrdersAdmin = async (req, res) => {
  try {
    const orders = await DealerOrder.find()
      .populate("dealer", "companyName contactPerson email phone discountPercent")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("ADMIN GET DEALER ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dealer orders."
    });
  }
};

// Admin: Create order directly for dealer / customer
export const createOrderAdmin = async (req, res) => {
  try {
    const { dealerId, items, notes, status, includeFullGst, billAmount, withoutBillAmount } = req.body;

    if (!dealerId) {
      return res.status(400).json({
        success: false,
        message: "Please select a dealer / customer."
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product item is required."
      });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.discountedPrice) || 0) * (Number(item.quantity) || 1),
      0
    );

    const isFullGst = includeFullGst !== false;
    let finalBillAmount = subtotal;
    let finalWithoutBillAmount = 0;
    let gstAmount = 0;

    if (isFullGst) {
      finalBillAmount = subtotal;
      finalWithoutBillAmount = 0;
      gstAmount = Math.round(subtotal * 0.18);
    } else {
      finalBillAmount = Number(billAmount) || 0;
      finalWithoutBillAmount = Number(withoutBillAmount) !== undefined
        ? Number(withoutBillAmount)
        : Math.max(0, subtotal - finalBillAmount);
      gstAmount = Math.round(finalBillAmount * 0.18);
    }

    const totalAmount = finalBillAmount + gstAmount + finalWithoutBillAmount;

    const order = await DealerOrder.create({
      dealer: dealerId,
      items,
      subtotal,
      includeFullGst: isFullGst,
      billAmount: finalBillAmount,
      withoutBillAmount: finalWithoutBillAmount,
      gstAmount,
      totalAmount,
      status: status || "Confirmed",
      notes: notes || ""
    });

    await createAndSendDealerNotification({
      dealerId: dealerId,
      orderId: order._id,
      title: `New Order Created by Admin`,
      message: `Official machinery order #${order._id.toString().slice(-8)} has been created for your dealership. Total: ₹${totalAmount.toLocaleString("en-IN")}.`,
      type: "order_created"
    });

    return res.status(201).json({
      success: true,
      message: "Order created for dealer successfully!",
      order
    });
  } catch (error) {
    console.error("ADMIN CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating dealer order."
    });
  }
};

// Admin: Update dealer order status or item wholesale prices & billing split
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalAmount, items, includeFullGst, billAmount, withoutBillAmount } = req.body;

    const order = await DealerOrder.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    const previousStatus = order.status;
    if (status) order.status = status;
    if (includeFullGst !== undefined) order.includeFullGst = Boolean(includeFullGst);

    if (items && Array.isArray(items)) {
      order.items = items;
      const subtotal = items.reduce(
        (sum, item) => sum + (Number(item.discountedPrice) || 0) * (Number(item.quantity) || 1),
        0
      );
      order.subtotal = subtotal;
    }

    const isFullGst = order.includeFullGst !== false;
    if (isFullGst) {
      order.billAmount = order.subtotal;
      order.withoutBillAmount = 0;
      order.gstAmount = Math.round(order.subtotal * 0.18);
      order.totalAmount = order.subtotal + order.gstAmount;
    } else {
      const bAmt = billAmount !== undefined ? Number(billAmount) : (order.billAmount || order.subtotal);
      const wAmt = withoutBillAmount !== undefined ? Number(withoutBillAmount) : (order.withoutBillAmount || Math.max(0, order.subtotal - bAmt));
      order.billAmount = bAmt;
      order.withoutBillAmount = wAmt;
      order.gstAmount = Math.round(bAmt * 0.18);
      order.totalAmount = bAmt + order.gstAmount + wAmt;
    }

    if (totalAmount !== undefined && (!items || items.length === 0)) {
      order.totalAmount = Number(totalAmount);
    }

    await order.save();

    // Trigger In-App & Push Notification for Dealer
    if (status && status !== previousStatus) {
      await createAndSendDealerNotification({
        dealerId: order.dealer,
        orderId: order._id,
        title: `Order Status: ${status.toUpperCase()}`,
        message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been updated to ${status}. Total: ₹${order.totalAmount.toLocaleString("en-IN")}.`,
        type: "status_update"
      });

      try {
        const dealerDoc = await Dealer.findById(order.dealer);
        if (dealerDoc && dealerDoc.email) {
          sendOrderStatusEmail({
            toEmail: dealerDoc.email,
            toName: dealerDoc.contactPerson || dealerDoc.companyName,
            orderId: order._id,
            status,
            totalAmount: order.totalAmount,
            items: order.items
          }).catch((err) => console.error("Status email send error:", err));
        }
      } catch (e) {
        console.error("Status update email fetch error:", e);
      }
    } else if (items && items.length > 0) {
      await createAndSendDealerNotification({
        dealerId: order.dealer,
        orderId: order._id,
        title: `Wholesale Rates / Tax Split Updated`,
        message: `Pricing or tax breakdown updated for order #${order._id.toString().slice(-8).toUpperCase()}. Total: ₹${order.totalAmount.toLocaleString("en-IN")}.`,
        type: "price_update"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order
    });
  } catch (error) {
    console.error("ADMIN UPDATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating order status."
    });
  }
};

// Admin: Delete dealer order
export const deleteOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await DealerOrder.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully."
    });
  } catch (error) {
    console.error("ADMIN DELETE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting order."
    });
  }
};

// Dealer: Get my notifications
export const getDealerNotifications = async (req, res) => {
  try {
    const notifications = await DealerNotification.find({ dealer: req.dealer.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await DealerNotification.countDocuments({
      dealer: req.dealer.id,
      read: false
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("GET DEALER NOTIFICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching notifications."
    });
  }
};

// Dealer: Mark notifications as read
export const markDealerNotificationsRead = async (req, res) => {
  try {
    await DealerNotification.updateMany(
      { dealer: req.dealer.id, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Notifications marked as read."
    });
  } catch (error) {
    console.error("MARK NOTIFICATIONS READ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error marking notifications read."
    });
  }
};

/* ======================================================
   GST LOOKUP API - Auto Fetch with Multi-Key Failover
====================================================== */
let currentApiKeyIndex = 0;

export const lookupGSTIN = async (req, res, next) => {
  const { gstin } = req.params;
  const cleanGSTIN = (gstin || "").trim().toUpperCase();

  if (!cleanGSTIN) {
    return res.status(400).json({ success: false, error: "GSTIN parameter is required." });
  }

  // Parse list of API keys from GST_API_KEYS (comma-separated) or GST_API_KEY
  const rawKeys = process.env.GST_API_KEYS || process.env.GST_API_KEY || "";
  const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);

  if (apiKeys.length === 0) {
    console.error("[GST LOOKUP]: No GST API keys found in .env");
    return next(new Error("Server Configuration Error: GST API Key not found."));
  }

  let lastError = null;

  for (let i = 0; i < apiKeys.length; i++) {
    const keyIndex = (currentApiKeyIndex + i) % apiKeys.length;
    const apiKey = apiKeys[keyIndex];

    try {
      console.log(`[GST LOOKUP]: Trying key #${keyIndex + 1}/${apiKeys.length} (${apiKey.substring(0, 6)}...)...`);
      const response = await axios.get(`https://sheet.gstincheck.co.in/check/${apiKey}/${cleanGSTIN}`, {
        timeout: 7000
      });
      const result = response.data;

      // Detect API Key limit / quota error
      const isQuotaExpired = result && (!result.flag) && (
        (result.message && /limit|quota|expired|exceed|credit/i.test(result.message)) ||
        result.errorCode === 429
      );

      if (isQuotaExpired) {
        console.warn(`[GST API ROTATION]: Key #${keyIndex + 1} limit expired. Swapping to next key...`);
        continue; // Try next key
      }

      if (!result || !result.flag || !result.data) {
        lastError = result?.message || "GSTIN not found or invalid.";
        break;
      }

      // Lock in working key index for future calls
      currentApiKeyIndex = keyIndex;
      const biz = result.data;
      const addr = biz.pradr?.addr || {};

      console.log(`[GST FETCH SUCCESS]: Captured details using Key #${keyIndex + 1} for ${biz.lgnm || biz.tradeNam}`);
      const combinedAddress = [
        addr.bnm, addr.bno, addr.flno, addr.st, addr.loc, addr.dst, addr.city
      ].filter(Boolean).join(", ");

      const payload = {
        success: true,
        companyName: biz.lgnm || biz.tradeNam,
        contactPerson: biz.lgnm || "",
        address: combinedAddress,
        city: addr.dst || addr.city || addr.loc || "",
        state: addr.stcd || "",
        pincode: addr.pncd || "",
        status: biz.sts || "Active",
        gstNumber: cleanGSTIN,
        data: {
          companyName: biz.lgnm || biz.tradeNam,
          address: combinedAddress,
          city: addr.dst || addr.city || addr.loc || "",
          state: addr.stcd || "",
          pincode: addr.pncd || "",
          status: biz.sts || "Active",
          gstNumber: cleanGSTIN
        }
      };

      return res.json(payload);
    } catch (err) {
      console.warn(`[GST API ROTATION]: Key #${keyIndex + 1} failed (${err.message}). Trying next key...`);
      lastError = err?.response?.data?.message || err.message;
      if (err.response?.status === 429 || err.response?.status === 403) {
        continue;
      }
    }
  }

  return res.status(404).json({
    success: false,
    error: lastError || "GSTIN not found or all API key limits exhausted."
  });
};
