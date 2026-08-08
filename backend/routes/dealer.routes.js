import express from "express";
import {
  registerDealer,
  loginDealer,
  getDealerProfile,
  updateDealerProfile,
  createDealerOrder,
  getDealerOrders,
  getAllDealersAdmin,
  updateDealerStatusAdmin,
  getAllDealerOrdersAdmin,
  updateOrderStatusAdmin,
  createOrderAdmin,
  deleteOrderAdmin,
  getDealerNotifications,
  markDealerNotificationsRead,
  lookupGSTIN
} from "../controllers/dealer.controller.js";
import { verifyDealer } from "../middleware/dealer.middleware.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerDealer);
router.post("/login", loginDealer);
router.get("/gst-lookup/:gstin", lookupGSTIN);

// Protected Dealer routes
router.get("/profile", verifyDealer, getDealerProfile);
router.put("/profile", verifyDealer, updateDealerProfile);
router.post("/orders", verifyDealer, createDealerOrder);
router.get("/orders", verifyDealer, getDealerOrders);
router.get("/notifications", verifyDealer, getDealerNotifications);
router.patch("/notifications/mark-read", verifyDealer, markDealerNotificationsRead);

// Admin routes for managing dealers
router.get("/admin/all", verifyAdmin, getAllDealersAdmin);
router.patch("/admin/:id/status", verifyAdmin, updateDealerStatusAdmin);
router.get("/admin/orders", verifyAdmin, getAllDealerOrdersAdmin);
router.post("/admin/orders/create", verifyAdmin, createOrderAdmin);
router.patch("/admin/orders/:id/status", verifyAdmin, updateOrderStatusAdmin);
router.delete("/admin/orders/:id", verifyAdmin, deleteOrderAdmin);

export default router;
