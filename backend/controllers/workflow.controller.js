import Inquiry from "../models/Inquiry.js";
import ProformaInvoice from "../models/ProformaInvoice.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import DealerOrder from "../models/DealerOrder.js";
import Dealer from "../models/Dealer.js";
import DealerNotification from "../models/DealerNotification.js";
import { sendRealtimeNotification } from "../utils/socket.js";

/**
 * Utility: Generate next sequential inquiry number (e.g. INQ-2026-0001)
 */
const getNextInquiryNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `INQ-${currentYear}-`;
  const count = await Inquiry.countDocuments({
    inquiryNumber: new RegExp(`^${prefix}`)
  });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
};

/**
 * Utility: Generate next sequential PI number (e.g. PI-2026-0001)
 */
const getNextPINumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `PI-${currentYear}-`;
  const count = await ProformaInvoice.countDocuments({
    invoiceNumber: new RegExp(`^${prefix}`)
  });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
};

/**
 * Utility: Generate next sequential PO number (e.g. PO-2026-0001)
 */
const getNextPONumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `PO-${currentYear}-`;
  const count = await PurchaseOrder.countDocuments({
    poNumber: new RegExp(`^${prefix}`)
  });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
};

/* ======================================================
   1. DEALER INQUIRY CONTROLLERS
====================================================== */

/**
 * Dealer: Create a new Inquiry
 */
export const createInquiry = async (req, res) => {
  try {
    const { items, requiredDeliveryDate, dealerRemarks } = req.body;
    const dealerId = req.dealer.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one machine/product for inquiry."
      });
    }

    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer account not found."
      });
    }

    const inquiryNumber = await getNextInquiryNumber();

    const formattedItems = items.map((item) => ({
      productId: item.productId || item._id || null,
      name: item.name || item.productTitle || "Commercial Machine",
      model: item.model || "",
      quantity: Number(item.quantity) || 1,
      specification: item.specification || item.configuration || "",
      dealerRemarks: item.dealerRemarks || item.remarks || ""
    }));

    const inquiry = await Inquiry.create({
      inquiryNumber,
      dealerId,
      items: formattedItems,
      requiredDeliveryDate: requiredDeliveryDate ? new Date(requiredDeliveryDate) : null,
      dealerRemarks: dealerRemarks || "",
      status: "SUBMITTED",
      auditTrail: [
        {
          action: "Inquiry Created",
          performedBy: dealer.contactPerson || dealer.companyName || "Dealer",
          role: "Dealer",
          timestamp: new Date(),
          note: "Dealer created inquiry from available catalog."
        }
      ]
    });

    // Create Notification & Realtime Socket Event
    await sendRealtimeNotification({
      dealerId,
      title: "Inquiry Submitted Successfully",
      message: `Your inquiry ${inquiryNumber} has been received and is submitted for Admin review.`,
      type: "order_created",
      data: { inquiryId: inquiry._id, inquiryNumber }
    });

    return res.status(201).json({
      success: true,
      message: "Dealer Inquiry created successfully!",
      inquiry
    });
  } catch (error) {
    console.error("CREATE INQUIRY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit inquiry."
    });
  }
};

/**
 * Dealer: Get all my inquiries
 */
export const getDealerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ dealerId: req.dealer.id })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error("GET DEALER INQUIRIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dealer inquiries."
    });
  }
};

/**
 * Admin: Get all inquiries
 */
export const getAdminInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("dealerId", "companyName contactPerson phone email gstNumber city state address")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error("GET ADMIN INQUIRIES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries for admin."
    });
  }
};

/* ======================================================
   2. ADMIN SETS PRICE & GENERATES PROFORMA INVOICE
====================================================== */

/**
 * Admin: Set selling prices for inquiry items & Generate Proforma Invoice
 */
export const generatePIFromInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const {
      items,
      freightCharges = 0,
      packagingCharges = 0,
      paymentTerms,
      deliveryTerms,
      warrantyTerms,
      validUntil,
      notes
    } = req.body;

    const inquiry = await Inquiry.findById(inquiryId).populate("dealerId");
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found."
      });
    }

    const dealer = inquiry.dealerId;
    if (!dealer) {
      return res.status(400).json({
        success: false,
        message: "Dealer details missing for this inquiry."
      });
    }

    // Process item prices set by Admin
    const processedItems = (items || inquiry.items).map((item) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const qty = Number(item.quantity) || 1;
      const disc = Number(item.discountPercent) || 0;
      const taxable = unitPrice * qty * (1 - disc / 100);
      const gstRate = Number(item.gstRate) || 18;
      const gstAmt = (taxable * gstRate) / 100;
      const totalAmt = taxable + gstAmt;

      return {
        productId: item.productId || item._id || null,
        name: item.name || "Commercial Machine",
        hsnCode: item.hsnCode || "8438",
        quantity: qty,
        unit: item.unit || "Set",
        unitPrice,
        discountPercent: disc,
        taxableAmount: Math.round(taxable),
        gstRate,
        gstAmount: Math.round(gstAmt),
        totalAmount: Math.round(totalAmt)
      };
    });

    const subtotal = processedItems.reduce((sum, i) => sum + i.taxableAmount, 0);
    const isInterstate = (dealer.state || "Gujarat").trim().toLowerCase() !== "gujarat";
    const totalGst = processedItems.reduce((sum, i) => sum + i.gstAmount, 0);

    const cgstAmount = isInterstate ? 0 : Math.round(totalGst / 2);
    const sgstAmount = isInterstate ? 0 : Math.round(totalGst / 2);
    const igstAmount = isInterstate ? Math.round(totalGst) : 0;

    const grandTotal = Math.round(subtotal + Number(freightCharges) + Number(packagingCharges) + totalGst);
    const advancePayment = Math.round(grandTotal * 0.5);
    const balanceDue = grandTotal - advancePayment;

    const invoiceNumber = await getNextPINumber();

    const newVersion = {
      versionNumber: 1,
      items: processedItems,
      subtotal,
      freightCharges: Number(freightCharges),
      packagingCharges: Number(packagingCharges),
      totalGst,
      grandTotal,
      advancePayment,
      balanceDue,
      paymentTerms: paymentTerms || "50% Advance with Purchase Order, 50% before Dispatch.",
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      notes: notes || "Factory Service Included. Subject to Rajkot Jurisdiction.",
      changedBy: req.user?.name || "Admin",
      changedAt: new Date(),
      reason: "Initial Proforma Invoice Generation"
    };

    const pi = await ProformaInvoice.create({
      invoiceNumber,
      invoiceDate: new Date(),
      validUntil: newVersion.validUntil,
      customerType: "Dealer",
      dealerId: dealer._id,
      inquiryId: inquiry._id,
      customerName: dealer.contactPerson || dealer.companyName,
      companyName: dealer.companyName || "",
      phone: dealer.phone || "",
      email: dealer.email || "",
      gstNumber: dealer.gstNumber || "",
      billingAddress: `${dealer.address || ""}, ${dealer.city || ""}, ${dealer.state || ""}`.trim(),
      shippingAddress: `${dealer.address || ""}, ${dealer.city || ""}, ${dealer.state || ""}`.trim(),
      city: dealer.city || "",
      state: dealer.state || "Gujarat",
      items: processedItems,
      subtotal,
      freightCharges: Number(freightCharges),
      packagingCharges: Number(packagingCharges),
      isInterstate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGst,
      grandTotal,
      advancePayment,
      balanceDue,
      paymentTerms: newVersion.paymentTerms,
      notes: newVersion.notes,
      version: 1,
      versions: [newVersion],
      isLocked: false,
      status: "Generated",
      auditTrail: [
        {
          version: 1,
          changedBy: req.user?.name || "Admin",
          role: "Admin",
          dateTime: new Date(),
          previousValue: "None (Inquiry)",
          newValue: `₹${grandTotal.toLocaleString("en-IN")}`,
          reason: "PI Generated by Admin"
        }
      ]
    });

    // Update Inquiry status
    inquiry.status = "PI_GENERATED";
    inquiry.auditTrail.push({
      action: "PI Generated",
      performedBy: req.user?.name || "Admin",
      role: "Admin",
      timestamp: new Date(),
      note: `Generated ${invoiceNumber} (Version 1) for ₹${grandTotal.toLocaleString("en-IN")}`
    });
    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: `Proforma Invoice ${invoiceNumber} generated!`,
      proformaInvoice: pi,
      inquiry
    });
  } catch (error) {
    console.error("GENERATE PI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate Proforma Invoice."
    });
  }
};

/**
 * Admin: Edit Generated PI (Creates New Version / Revision)
 */
export const updatePIVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      items,
      freightCharges,
      packagingCharges,
      paymentTerms,
      validUntil,
      notes,
      reason
    } = req.body;

    const pi = await ProformaInvoice.findById(id);
    if (!pi) {
      return res.status(404).json({
        success: false,
        message: "Proforma Invoice not found."
      });
    }

    if (pi.isLocked) {
      return res.status(400).json({
        success: false,
        message: "This Proforma Invoice has been confirmed by dealer and is locked. Cannot alter confirmed version directly."
      });
    }

    const previousTotal = pi.grandTotal;
    const nextVersionNum = (pi.version || 1) + 1;

    // Recalculate financial breakdown
    const processedItems = (items || pi.items).map((item) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const qty = Number(item.quantity) || 1;
      const disc = Number(item.discountPercent) || 0;
      const taxable = unitPrice * qty * (1 - disc / 100);
      const gstRate = Number(item.gstRate) || 18;
      const gstAmt = (taxable * gstRate) / 100;
      const totalAmt = taxable + gstAmt;

      return {
        productId: item.productId || item._id || null,
        name: item.name || "Commercial Machine",
        hsnCode: item.hsnCode || "8438",
        quantity: qty,
        unit: item.unit || "Set",
        unitPrice,
        discountPercent: disc,
        taxableAmount: Math.round(taxable),
        gstRate,
        gstAmount: Math.round(gstAmt),
        totalAmount: Math.round(totalAmt)
      };
    });

    const subtotal = processedItems.reduce((sum, i) => sum + i.taxableAmount, 0);
    const totalGst = processedItems.reduce((sum, i) => sum + i.gstAmount, 0);
    const fCharges = freightCharges !== undefined ? Number(freightCharges) : (pi.freightCharges || 0);
    const pCharges = packagingCharges !== undefined ? Number(packagingCharges) : (pi.packagingCharges || 0);

    const cgstAmount = pi.isInterstate ? 0 : Math.round(totalGst / 2);
    const sgstAmount = pi.isInterstate ? 0 : Math.round(totalGst / 2);
    const igstAmount = pi.isInterstate ? Math.round(totalGst) : 0;

    const grandTotal = Math.round(subtotal + fCharges + pCharges + totalGst);
    const advancePayment = Math.round(grandTotal * 0.5);
    const balanceDue = grandTotal - advancePayment;

    const newVersionSnapshot = {
      versionNumber: nextVersionNum,
      items: processedItems,
      subtotal,
      freightCharges: fCharges,
      packagingCharges: pCharges,
      totalGst,
      grandTotal,
      advancePayment,
      balanceDue,
      paymentTerms: paymentTerms || pi.paymentTerms,
      validUntil: validUntil ? new Date(validUntil) : pi.validUntil,
      notes: notes || pi.notes,
      changedBy: req.user?.name || "Admin",
      changedAt: new Date(),
      reason: reason || `Admin revised price to ₹${grandTotal.toLocaleString("en-IN")}`
    };

    // Update active PI record
    pi.version = nextVersionNum;
    pi.items = processedItems;
    pi.subtotal = subtotal;
    pi.freightCharges = fCharges;
    pi.packagingCharges = pCharges;
    pi.cgstAmount = cgstAmount;
    pi.sgstAmount = sgstAmount;
    pi.igstAmount = igstAmount;
    pi.totalGst = totalGst;
    pi.grandTotal = grandTotal;
    pi.advancePayment = advancePayment;
    pi.balanceDue = balanceDue;
    if (paymentTerms) pi.paymentTerms = paymentTerms;
    if (validUntil) pi.validUntil = new Date(validUntil);
    if (notes) pi.notes = notes;
    pi.status = "Revised";

    pi.versions.push(newVersionSnapshot);
    pi.auditTrail.push({
      version: nextVersionNum,
      changedBy: req.user?.name || "Admin",
      role: "Admin",
      dateTime: new Date(),
      previousValue: `₹${previousTotal.toLocaleString("en-IN")} (v${nextVersionNum - 1})`,
      newValue: `₹${grandTotal.toLocaleString("en-IN")} (v${nextVersionNum})`,
      reason: reason || "Price / Commercial terms revised by Admin"
    });

    await pi.save();

    // Notify Dealer if inquiry linked
    if (pi.dealerId) {
      await sendRealtimeNotification({
        dealerId: pi.dealerId,
        title: `Proforma Invoice ${pi.invoiceNumber} Revised`,
        message: `Admin updated PI ${pi.invoiceNumber} (Version ${nextVersionNum}). New Total: ₹${grandTotal.toLocaleString("en-IN")}.`,
        type: "price_update",
        data: { invoiceId: pi._id, version: nextVersionNum }
      });
    }

    return res.status(200).json({
      success: true,
      message: `Proforma Invoice updated to Version ${nextVersionNum}!`,
      proformaInvoice: pi
    });
  } catch (error) {
    console.error("UPDATE PI VERSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update PI version."
    });
  }
};

/**
 * Admin: Send PI to Dealer
 */
export const sendPIToDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const pi = await ProformaInvoice.findById(id);
    if (!pi) {
      return res.status(404).json({ success: false, message: "Proforma Invoice not found." });
    }

    pi.status = "SENT_TO_DEALER";
    await pi.save();

    if (pi.inquiryId) {
      const inquiry = await Inquiry.findById(pi.inquiryId);
      if (inquiry) {
        inquiry.status = "PI_SENT_TO_DEALER";
        inquiry.auditTrail.push({
          action: "PI Sent to Dealer",
          performedBy: req.user?.name || "Admin",
          role: "Admin",
          timestamp: new Date(),
          note: `Sent ${pi.invoiceNumber} (v${pi.version}) to Dealer`
        });
        await inquiry.save();
      }
    }

    if (pi.dealerId) {
      await sendRealtimeNotification({
        dealerId: pi.dealerId,
        title: "New Proforma Invoice Available",
        message: `Proforma Invoice ${pi.invoiceNumber} (v${pi.version}) is ready for your review and confirmation.`,
        type: "order_created",
        data: { invoiceId: pi._id }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Proforma Invoice sent to dealer successfully!",
      proformaInvoice: pi
    });
  } catch (error) {
    console.error("SEND PI TO DEALER ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to send PI to dealer." });
  }
};

/* ======================================================
   3. DEALER CONFIRMS PI & AUTOMATIC PO GENERATION
====================================================== */

/**
 * Dealer: Confirm Proforma Invoice
 * (Automatically creates Customer Purchase Order from latest active confirmed PI version!)
 */
export const confirmPI = async (req, res) => {
  try {
    const { id } = req.params;
    const dealerId = req.dealer.id;

    const pi = await ProformaInvoice.findById(id);
    if (!pi) {
      return res.status(404).json({ success: false, message: "Proforma Invoice not found." });
    }

    if (String(pi.dealerId) !== String(dealerId)) {
      return res.status(403).json({ success: false, message: "Unauthorized action on this invoice." });
    }

    if (pi.isLocked || pi.status === "CONFIRMED" || pi.status === "Confirmed") {
      return res.status(400).json({ success: false, message: "PI is already confirmed." });
    }

    // 1. Lock PI and update status
    pi.status = "CONFIRMED";
    pi.isLocked = true;
    pi.auditTrail.push({
      version: pi.version,
      changedBy: req.dealer.companyName || "Dealer",
      role: "Dealer",
      dateTime: new Date(),
      previousValue: "SENT_TO_DEALER",
      newValue: "CONFIRMED",
      reason: "Dealer confirmed products, quantities, prices, taxes & terms"
    });
    await pi.save();

    // 2. Fetch latest confirmed version details
    const latestVersionObj = (pi.versions && pi.versions.length > 0)
      ? pi.versions[pi.versions.length - 1]
      : pi;

    // 3. Auto-generate Customer Purchase Order
    const poNumber = await getNextPONumber();
    const dealerDoc = await Dealer.findById(dealerId);

    const poItems = (latestVersionObj.items || pi.items).map((item) => ({
      productId: item.productId || null,
      name: item.name,
      model: item.model || "",
      description: item.specification || "",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountPercent: item.discountPercent || 0,
      taxableAmount: item.taxableAmount,
      gstRate: item.gstRate || 18,
      gstAmount: item.gstAmount,
      totalAmount: item.totalAmount
    }));

    const purchaseOrder = await PurchaseOrder.create({
      poNumber,
      poDate: new Date(),
      inquiryId: pi.inquiryId || null,
      proformaInvoiceId: pi._id,
      piVersionNumber: pi.version,
      dealerId,
      sellerDetails: {
        companyName: "Durga Manufactures",
        brand: "Millzon",
        gstin: "24HMPT0206E1ZO",
        pan: "HMPT0206E",
        udyam: "GJ-20-0130533",
        address: "Plot No. A5, Shapar Main Road, Opp. Mahindra Gear, Decora Cement Campus, Shapar (Veraval) 360024, Rajkot, Gujarat, India.",
        phone: "+91 94281 56213, +91 98258 70821",
        email: "durgamanufactures2010@gmail.com",
        bankName: "Bank Of Baroda, Aji GIDC, Rajkot",
        accountName: "DURGA MANUFACTURES",
        accountNumber: "17400200000634",
        ifscCode: "BARB0AJIRAJ"
      },
      buyerDetails: {
        dealerName: dealerDoc ? dealerDoc.contactPerson : pi.customerName,
        companyName: dealerDoc ? dealerDoc.companyName : pi.companyName,
        gstin: dealerDoc ? dealerDoc.gstNumber : pi.gstNumber,
        billingAddress: pi.billingAddress,
        shippingAddress: pi.shippingAddress || pi.billingAddress,
        contactPerson: dealerDoc ? dealerDoc.contactPerson : pi.customerName,
        phone: dealerDoc ? dealerDoc.phone : pi.phone,
        email: dealerDoc ? dealerDoc.email : pi.email,
        city: dealerDoc ? dealerDoc.city : pi.city,
        state: dealerDoc ? dealerDoc.state : pi.state
      },
      items: poItems,
      financials: {
        subtotal: pi.subtotal,
        freightCharges: pi.freightCharges,
        packagingCharges: pi.packagingCharges,
        isInterstate: pi.isInterstate,
        cgstAmount: pi.cgstAmount,
        sgstAmount: pi.sgstAmount,
        igstAmount: pi.igstAmount,
        totalGst: pi.totalGst,
        grandTotal: pi.grandTotal,
        advancePayment: pi.advancePayment,
        balanceDue: pi.balanceDue
      },
      commercialTerms: {
        paymentTerms: pi.paymentTerms,
        deliveryTerms: "Ex-factory Rajkot, Gujarat.",
        warrantyTerms: "1 Year Pan-India Warranty.",
        installationTerms: "Electric panel board, wiring on customer.",
        freightTerms: "Transportation charges on customer.",
        otherTerms: pi.notes
      },
      signedPoDocument: {
        status: "NOT_UPLOADED"
      },
      status: "AWAITING_DEALER_SIGNATURE",
      isCommerciallyLocked: false,
      auditTrail: [
        {
          action: "PO Automatically Generated",
          performedBy: "System",
          role: "System",
          timestamp: new Date(),
          note: `Generated from confirmed PI ${pi.invoiceNumber} Version ${pi.version}`
        }
      ]
    });

    // Update Inquiry status if linked
    if (pi.inquiryId) {
      const inquiry = await Inquiry.findById(pi.inquiryId);
      if (inquiry) {
        inquiry.status = "AWAITING_SIGNED_PO";
        inquiry.auditTrail.push({
          action: "PI Confirmed & PO Generated",
          performedBy: dealerDoc?.contactPerson || "Dealer",
          role: "Dealer",
          timestamp: new Date(),
          note: `Dealer confirmed PI. PO ${poNumber} generated automatically.`
        });
        await inquiry.save();
      }
    }

    // Create Dealer Notification & Socket Emit
    await sendRealtimeNotification({
      dealerId,
      title: `Purchase Order ${poNumber} Generated`,
      message: `Your Purchase Order ${poNumber} has been generated! Please download it, sign, apply company stamp, and upload the signed document.`,
      type: "order_created",
      data: { poId: purchaseOrder._id, poNumber }
    });

    return res.status(200).json({
      success: true,
      message: `PI Confirmed! Purchase Order ${poNumber} generated automatically. Please download, sign, stamp, and upload the PO.`,
      proformaInvoice: pi,
      purchaseOrder
    });
  } catch (error) {
    console.error("CONFIRM PI ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to confirm PI." });
  }
};

/* ======================================================
   4. DEALER UPLOADS SIGNED PO & ADMIN VERIFICATION
====================================================== */

/**
 * Dealer: Upload Signed & Stamped PO Document
 */
export const uploadSignedPO = async (req, res) => {
  try {
    const { poId } = req.params;
    const { fileUrl, fileName, fileType } = req.body;
    const dealerId = req.dealer.id;

    const po = await PurchaseOrder.findById(poId);
    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found." });
    }

    if (String(po.dealerId) !== String(dealerId)) {
      return res.status(403).json({ success: false, message: "Unauthorized action." });
    }

    if (!fileUrl) {
      return res.status(400).json({ success: false, message: "Signed PO file document URL/data is required." });
    }

    po.signedPoDocument = {
      fileUrl,
      fileName: fileName || "Signed_Purchase_Order",
      fileType: fileType || "application/pdf",
      uploadedAt: new Date(),
      uploadedBy: req.dealer.companyName || "Dealer",
      status: "PENDING",
      rejectionReason: ""
    };

    po.status = "SIGNED_PO_UPLOADED";
    po.auditTrail.push({
      action: "Signed PO Uploaded",
      performedBy: req.dealer.companyName || "Dealer",
      role: "Dealer",
      timestamp: new Date(),
      note: `Uploaded signed PO document (${fileName || "File"})`
    });

    await po.save();

    // Update Inquiry
    if (po.inquiryId) {
      const inquiry = await Inquiry.findById(po.inquiryId);
      if (inquiry) {
        inquiry.status = "SIGNED_PO_UPLOADED";
        inquiry.auditTrail.push({
          action: "Signed PO Uploaded",
          performedBy: req.dealer.companyName || "Dealer",
          role: "Dealer",
          timestamp: new Date(),
          note: "Dealer uploaded signed & stamped PO for Admin review."
        });
        await inquiry.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Signed Purchase Order uploaded successfully! Submitted for Admin verification.",
      purchaseOrder: po
    });
  } catch (error) {
    console.error("UPLOAD SIGNED PO ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to upload signed PO." });
  }
};

/**
 * Admin: Verify Signed PO (Approve or Reject with reason)
 */
export const verifySignedPO = async (req, res) => {
  try {
    const { poId } = req.params;
    const { action, rejectionReason } = req.body; // action: "APPROVE" | "REJECT"

    const po = await PurchaseOrder.findById(poId).populate("proformaInvoiceId");
    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found." });
    }

    if (action === "REJECT") {
      if (!rejectionReason) {
        return res.status(400).json({ success: false, message: "Rejection reason is required when rejecting signed PO." });
      }

      po.signedPoDocument.status = "REJECTED";
      po.signedPoDocument.rejectionReason = rejectionReason;
      po.signedPoDocument.reviewedAt = new Date();
      po.signedPoDocument.reviewedBy = req.user?.name || "Admin";

      po.status = "SIGNED_PO_REJECTED";
      po.auditTrail.push({
        action: "Signed PO Rejected",
        performedBy: req.user?.name || "Admin",
        role: "Admin",
        timestamp: new Date(),
        note: `Rejected signed PO: "${rejectionReason}"`
      });

      await po.save();

      if (po.inquiryId) {
        const inquiry = await Inquiry.findById(po.inquiryId);
        if (inquiry) {
          inquiry.status = "SIGNED_PO_REJECTED";
          inquiry.auditTrail.push({
            action: "Signed PO Rejected by Admin",
            performedBy: req.user?.name || "Admin",
            role: "Admin",
            timestamp: new Date(),
            note: rejectionReason
          });
          await inquiry.save();
        }
      }

      await sendRealtimeNotification({
        dealerId: po.dealerId,
        title: `Signed PO Action Needed: Rejected`,
        message: `Your uploaded signed PO for ${po.poNumber} was not approved: "${rejectionReason}". Please upload a clear/stamped document.`,
        type: "approval_update",
        data: { poId: po._id, rejectionReason }
      });

      return res.status(200).json({
        success: true,
        message: "Signed PO rejected. Notification sent to dealer for re-upload.",
        purchaseOrder: po
      });
    }

    if (action === "APPROVE") {
      po.signedPoDocument.status = "APPROVED";
      po.signedPoDocument.reviewedAt = new Date();
      po.signedPoDocument.reviewedBy = req.user?.name || "Admin";

      po.status = "ORDER_CONFIRMED";
      po.isCommerciallyLocked = true;
      po.auditTrail.push({
        action: "Signed PO Approved & Order Confirmed",
        performedBy: req.user?.name || "Admin",
        role: "Admin",
        timestamp: new Date(),
        note: "Signed PO verified and approved. Order status set to CONFIRMED."
      });

      await po.save();

      // Update Inquiry
      if (po.inquiryId) {
        const inquiry = await Inquiry.findById(po.inquiryId);
        if (inquiry) {
          inquiry.status = "ORDER_CONFIRMED";
          inquiry.auditTrail.push({
            action: "ORDER CONFIRMED",
            performedBy: req.user?.name || "Admin",
            role: "Admin",
            timestamp: new Date(),
            note: "Order commercially locked and confirmed."
          });
          await inquiry.save();
        }
      }

      // Create or update DealerOrder for ERP compatibility
      const orderItems = po.items.map((item) => ({
        product: item.productId,
        productTitle: item.name,
        quantity: item.quantity,
        originalPrice: item.unitPrice,
        discountedPrice: item.unitPrice * (1 - (item.discountPercent || 0) / 100)
      }));

      await DealerOrder.create({
        dealer: po.dealerId,
        items: orderItems,
        subtotal: po.financials.subtotal,
        includeFullGst: true,
        billAmount: po.financials.subtotal,
        withoutBillAmount: 0,
        gstAmount: po.financials.totalGst,
        totalAmount: po.financials.grandTotal,
        status: "Confirmed",
        notes: `Confirmed via Workflow PO ${po.poNumber}`
      });

      await sendRealtimeNotification({
        dealerId: po.dealerId,
        title: `ORDER CONFIRMED! #${po.poNumber}`,
        message: `Congratulations! Your Purchase Order ${po.poNumber} has been verified & approved by Admin. Your order is officially confirmed.`,
        type: "approval_update",
        data: { poId: po._id, poNumber }
      });

      return res.status(200).json({
        success: true,
        message: "Signed PO approved! Order is now officially CONFIRMED.",
        purchaseOrder: po
      });
    }

    return res.status(400).json({ success: false, message: "Invalid action specified." });
  } catch (error) {
    console.error("VERIFY SIGNED PO ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to verify signed PO." });
  }
};

/**
 * Get POs by Dealer
 */
export const getDealerPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find({ dealerId: req.dealer.id })
      .populate("proformaInvoiceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      purchaseOrders: pos
    });
  } catch (error) {
    console.error("GET DEALER POS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch POs." });
  }
};

/**
 * Get All POs for Admin
 */
export const getAdminPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find()
      .populate("dealerId", "companyName contactPerson phone email gstNumber")
      .populate("proformaInvoiceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      purchaseOrders: pos
    });
  } catch (error) {
    console.error("GET ADMIN POS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch POs for admin." });
  }
};

/**
 * Dashboard & Workflow Analytics Summary
 */
export const getWorkflowSummary = async (req, res) => {
  try {
    const isDealer = req.dealer && req.dealer.role !== "admin";
    const filter = isDealer ? { dealerId: req.dealer.id } : {};

    const [inquiries, invoices, pos] = await Promise.all([
      Inquiry.find(filter),
      ProformaInvoice.find(isDealer ? { dealerId: req.dealer.id } : {}),
      PurchaseOrder.find(filter)
    ]);

    const summary = {
      newInquiries: inquiries.filter(i => i.status === "SUBMITTED" || i.status === "UNDER_REVIEW").length,
      pendingPriceApproval: inquiries.filter(i => i.status === "UNDER_REVIEW").length,
      piPending: invoices.filter(i => i.status === "DRAFT" || i.status === "Generated").length,
      piSent: invoices.filter(i => i.status === "SENT_TO_DEALER" || i.status === "Sent").length,
      piUnderNegotiation: invoices.filter(i => i.status === "Revised" || i.status === "REVISED").length,
      piConfirmed: invoices.filter(i => i.status === "CONFIRMED" || i.status === "Confirmed").length,
      poAwaitingSignedCopy: pos.filter(p => p.status === "AWAITING_DEALER_SIGNATURE").length,
      signedPoPendingApproval: pos.filter(p => p.status === "SIGNED_PO_UPLOADED").length,
      confirmedOrders: pos.filter(p => p.status === "ORDER_CONFIRMED").length,
      cancelledOrders: inquiries.filter(i => i.status === "CANCELLED").length
    };

    return res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("GET WORKFLOW SUMMARY ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch workflow summary." });
  }
};
