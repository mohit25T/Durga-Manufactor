import express from "express";
import {
  getNextInvoiceNumber,
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  createFromDealerOrder
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.get("/next-number", getNextInvoiceNumber);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
router.post("/from-dealer-order/:orderId", createFromDealerOrder);

export default router;
