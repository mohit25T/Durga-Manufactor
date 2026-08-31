import ProformaInvoice from "../models/ProformaInvoice.js";
import DealerOrder from "../models/DealerOrder.js";
import Dealer from "../models/Dealer.js";
import Product from "../models/Product.js";
import Inquiry from "../models/Inquiry.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

/**
 * Generate next sequential invoice number (e.g. PI-2026-0001)
 */
export const getNextInvoiceNumber = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const prefix = `PI-${currentYear}-`;

    const lastInvoice = await ProformaInvoice.findOne({
      invoiceNumber: new RegExp(`^${prefix}`)
    }).sort({ createdAt: -1 });

    let nextSeq = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split("-");
      if (parts.length === 3) {
        const parsed = parseInt(parts[2], 10);
        if (!isNaN(parsed)) {
          nextSeq = parsed + 1;
        }
      }
    }

    const nextInvoiceNumber = `${prefix}${String(nextSeq).padStart(4, "0")}`;

    return res.status(200).json({
      success: true,
      invoiceNumber: nextInvoiceNumber
    });
  } catch (err) {
    console.error("Error generating next invoice number:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate invoice number",
      error: err.message
    });
  }
};

const cleanInvoiceData = (data) => {
  const cleaned = { ...data };
  if (!cleaned.dealerId || cleaned.dealerId === "") delete cleaned.dealerId;
  if (!cleaned.leadId || cleaned.leadId === "") delete cleaned.leadId;
  if (Array.isArray(cleaned.items)) {
    cleaned.items = cleaned.items.map((item) => {
      const cleanedItem = { ...item };
      if (!cleanedItem.productId || cleanedItem.productId === "") {
        delete cleanedItem.productId;
      }
      return cleanedItem;
    });
  }
  return cleaned;
};

/**
 * Create a new Proforma Invoice
 */
export const createInvoice = async (req, res) => {
  try {
    const data = cleanInvoiceData(req.body);

    // Auto-generate invoice number if missing
    if (!data.invoiceNumber) {
      const currentYear = new Date().getFullYear();
      const prefix = `PI-${currentYear}-`;
      const count = await ProformaInvoice.countDocuments({
        invoiceNumber: new RegExp(`^${prefix}`)
      });
      data.invoiceNumber = `${prefix}${String(count + 1).padStart(4, "0")}`;
    }

    // Verify uniqueness
    const existing = await ProformaInvoice.findOne({ invoiceNumber: data.invoiceNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Invoice number ${data.invoiceNumber} already exists.`
      });
    }

    const newInvoice = new ProformaInvoice(data);
    await newInvoice.save();

    return res.status(201).json({
      success: true,
      message: "Proforma Invoice created successfully!",
      invoice: newInvoice
    });
  } catch (err) {
    console.error("Error creating invoice:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create Proforma Invoice"
    });
  }
};

/**
 * Get all Proforma Invoices with search and filtering
 */
export const getInvoices = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { invoiceNumber: regex },
        { customerName: regex },
        { companyName: regex },
        { phone: regex },
        { email: regex }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const invoices = await ProformaInvoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ProformaInvoice.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      invoices
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices"
    });
  }
};

/**
 * Get single Proforma Invoice by ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await ProformaInvoice.findById(req.params.id)
      .populate("dealerId", "companyName contactPerson phone email gstNumber city state")
      .populate("leadId", "name company phone email message");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    return res.status(200).json({
      success: true,
      invoice
    });
  } catch (err) {
    console.error("Error fetching invoice by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice"
    });
  }
};

/**
 * Update Proforma Invoice
 */
export const updateInvoice = async (req, res) => {
  try {
    const cleanedData = cleanInvoiceData(req.body);
    const updatedInvoice = await ProformaInvoice.findByIdAndUpdate(
      req.params.id,
      { $set: cleanedData },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully!",
      invoice: updatedInvoice
    });
  } catch (err) {
    console.error("Error updating invoice:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update invoice"
    });
  }
};

/**
 * Delete Proforma Invoice
 */
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await ProformaInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    // Reset linked inquiry status back to SUBMITTED if inquiry exists
    if (invoice.inquiryId) {
      await Inquiry.findByIdAndUpdate(invoice.inquiryId, {
        $set: { status: "SUBMITTED" }
      });
    }

    // Delete any Purchase Orders created from this Proforma Invoice
    await PurchaseOrder.deleteMany({ proformaInvoiceId: invoice._id });

    // Delete the Proforma Invoice
    await ProformaInvoice.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Proforma Invoice deleted successfully!"
    });
  } catch (err) {
    console.error("Error deleting invoice:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete invoice"
    });
  }
};

/**
 * Generate Proforma Invoice directly from a Dealer Order ID
 */
export const createFromDealerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await DealerOrder.findById(orderId).populate("dealer");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Dealer order not found"
      });
    }

    const dealer = order.dealer || {};
    const currentYear = new Date().getFullYear();
    const prefix = `PI-${currentYear}-`;
    const count = await ProformaInvoice.countDocuments({
      invoiceNumber: new RegExp(`^${prefix}`)
    });
    const invoiceNumber = `${prefix}${String(count + 1).padStart(4, "0")}`;

    // Map order items to invoice items
    const items = (order.items || []).map((item) => {
      const unitPrice = item.discountedPrice || item.originalPrice || 0;
      const qty = item.quantity || 1;
      const taxable = unitPrice * qty;
      const gstAmt = (taxable * 18) / 100;
      return {
        productId: item.product && item.product._id ? item.product._id : null,
        name: item.productTitle || "Commercial Machinery",
        hsnCode: "8438",
        quantity: qty,
        unit: "Set",
        unitPrice,
        discountPercent: 0,
        taxableAmount: taxable,
        gstRate: 18,
        gstAmount: gstAmt,
        totalAmount: taxable + gstAmt
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.taxableAmount, 0);
    const isInterstate = (dealer.state || "Gujarat").trim().toLowerCase() !== "gujarat";
    const totalGst = items.reduce((sum, i) => sum + i.gstAmount, 0);

    const cgstAmount = isInterstate ? 0 : totalGst / 2;
    const sgstAmount = isInterstate ? 0 : totalGst / 2;
    const igstAmount = isInterstate ? totalGst : 0;

    const grandTotal = subtotal + totalGst;
    const advancePayment = Math.round(grandTotal * 0.5); // 50% advance
    const balanceDue = grandTotal - advancePayment;

    const newInvoice = new ProformaInvoice({
      invoiceNumber,
      customerType: "Dealer",
      dealerId: dealer._id || null,
      customerName: dealer.contactPerson || dealer.companyName || "Dealer",
      companyName: dealer.companyName || "",
      phone: dealer.phone || "",
      email: dealer.email || "",
      gstNumber: dealer.gstNumber || "",
      billingAddress: `${dealer.address || ""}, ${dealer.city || ""}, ${dealer.state || ""}`.trim(),
      shippingAddress: `${dealer.address || ""}, ${dealer.city || ""}, ${dealer.state || ""}`.trim(),
      city: dealer.city || "",
      state: dealer.state || "Gujarat",
      items,
      subtotal,
      freightCharges: 0,
      packagingCharges: 0,
      isInterstate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalGst,
      grandTotal,
      advancePayment,
      balanceDue,
      status: "Sent"
    });

    await newInvoice.save();

    return res.status(201).json({
      success: true,
      message: "Proforma Invoice generated from Dealer Order!",
      invoice: newInvoice
    });
  } catch (err) {
    console.error("Error creating invoice from order:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate invoice from order"
    });
  }
};
