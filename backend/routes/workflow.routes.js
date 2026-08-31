import express from "express";
import {
  createInquiry,
  getDealerInquiries,
  getAdminInquiries,
  generatePIFromInquiry,
  updatePIVersion,
  sendPIToDealer,
  confirmPI,
  regeneratePI,
  uploadSignedPO,
  verifySignedPO,
  getDealerPOs,
  getAdminPOs,
  getWorkflowSummary,
  getDealerPrices,
  deleteInquiry,
  updateInquiry
} from "../controllers/workflow.controller.js";
import { verifyDealer } from "../middleware/dealer.middleware.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Inquiry routes
router.post("/inquiries", verifyDealer, createInquiry);
router.get("/inquiries/dealer", verifyDealer, getDealerInquiries);
router.get("/inquiries/admin", verifyAdmin, getAdminInquiries);
router.post("/inquiries/:inquiryId/generate-pi", verifyAdmin, generatePIFromInquiry);
router.put("/inquiries/:id", verifyDealer, updateInquiry);
router.delete("/inquiries/:id", deleteInquiry);
router.get("/dealer-prices/:dealerId", getDealerPrices);

// PI Versioning & Confirmation routes
router.put("/pi/:id/version", verifyAdmin, updatePIVersion);
router.post("/pi/:id/send", verifyAdmin, sendPIToDealer);
router.post("/pi/:id/confirm", verifyDealer, confirmPI);
router.post("/pi/:id/regenerate", verifyDealer, regeneratePI);
router.post("/pi/:id/regenerate-admin", verifyAdmin, regeneratePI);

// Purchase Order & Signed Document routes
router.post("/po/:poId/upload-signed", verifyDealer, uploadSignedPO);
router.post("/po/:poId/verify", verifyAdmin, verifySignedPO);
router.get("/po/dealer", verifyDealer, getDealerPOs);
router.get("/po/admin", verifyAdmin, getAdminPOs);

// Dashboard Summary
router.get("/summary", getWorkflowSummary);

export default router;
