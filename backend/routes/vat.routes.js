import express from "express";
import {
  validateVat,
  getVatRate,
  calculateVatPrice,
} from "../controllers/vat.controller.js";

const router = express.Router();

router.get("/validate", validateVat);
router.get("/rate", getVatRate);
router.get("/price", calculateVatPrice);

export default router;
