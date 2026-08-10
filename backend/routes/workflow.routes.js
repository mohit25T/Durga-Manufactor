import express from "express";
import {
  createInquiry,
  getDealerInquiries,
  getAdminInquiries,
  generatePIFromInquiry,
  updatePIVersion,
  sendPIToDealer,
  confirmPI,
  uploadSignedPO,
  verifySignedPO,
  getDealerPOs,
  getAdminPOs,
  getWorkflowSummary
} from "../controllers/workflow.controller.js";
import { verifyDealer } from "../middleware/dealer.middleware.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Inquiry routes
router.post("/inquiries", verifyDealer, createInquiry);
router.get("/inquiries/dealer", verifyDealer, getDealerInquiries);
router.get("/inquiries/admin", verifyAdmin, getAdminInquiries);
router.post("/inquiries/:inquiryId/generate-pi", verifyAdmin, generatePIFromInquiry);

// PI Versioning & Confirmation routes
router.put("/pi/:id/version", verifyAdmin, updatePIVersion);
router.post("/pi/:id/send", verifyAdmin, sendPIToDealer);
router.post("/pi/:id/confirm", verifyDealer, confirmPI);

// Purchase Order & Signed Document routes
router.post("/po/:poId/upload-signed", verifyDealer, uploadSignedPO);
router.post("/po/:poId/verify", verifyAdmin, verifySignedPO);
router.get("/po/dealer", verifyDealer, getDealerPOs);
router.get("/po/admin", verifyAdmin, getAdminPOs);

// Dashboard Summary
router.get("/summary", getWorkflowSummary);

export default router;
