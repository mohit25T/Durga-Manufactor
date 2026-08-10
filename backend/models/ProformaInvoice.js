import mongoose from "mongoose";

const sanitizeObjectId = (v) => (v && v !== "" && v !== "null" ? v : null);

const invoiceItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
    set: sanitizeObjectId
  },
  name: {
    type: String,
    required: true
  },
  hsnCode: {
    type: String,
    default: "8438"
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unit: {
    type: String,
    default: "Set"
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxableAmount: {
    type: Number,
    required: true
  },
  gstRate: {
    type: Number,
    default: 18
  },
  gstAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

const proformaInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    invoiceDate: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // Default 15 days validity
    },
    customerType: {
      type: String,
      enum: ["Dealer", "Lead", "Custom"],
      default: "Custom"
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: false,
      set: sanitizeObjectId
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: false,
      set: sanitizeObjectId
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    companyName: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    gstNumber: {
      type: String,
      trim: true,
      default: ""
    },
    billingAddress: {
      type: String,
      required: true
    },
    shippingAddress: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: "Gujarat"
    },
    pincode: {
      type: String,
      default: ""
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    freightCharges: {
      type: Number,
      default: 0
    },
    packagingCharges: {
      type: Number,
      default: 0
    },
    isInterstate: {
      type: Boolean,
      default: false
    },
    cgstAmount: {
      type: Number,
      default: 0
    },
    sgstAmount: {
      type: Number,
      default: 0
    },
    igstAmount: {
      type: Number,
      default: 0
    },
    totalGst: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0
    },
    advancePayment: {
      type: Number,
      default: 0
    },
    balanceDue: {
      type: Number,
      default: 0
    },
    paymentTerms: {
      type: String,
      default: "50% Advance with Purchase Order, 50% before Dispatch from Rajkot Factory."
    },
    notes: {
      type: String,
      default: "Pan-India Warranty & Factory Service Included. Subject to Rajkot Jurisdiction."
    },
    udyamNumber: {
      type: String,
      default: "GJ-20-0130533"
    },
    bankDetails: {
      bankName: { type: String, default: "Bank Of Baroda, Aji GIDC, Rajkot" },
      accountName: { type: String, default: "DURGA MANUFACTURES" },
      accountNumber: { type: String, default: "17400200000634" },
      ifscCode: { type: String, default: "BARB0AJIRAJ" },
      branch: { type: String, default: "Aji GIDC, Rajkot" }
    },
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
      required: false,
      set: sanitizeObjectId
    },
    version: {
      type: Number,
      default: 1
    },
    versions: [
      {
        versionNumber: { type: Number, required: true },
        items: [invoiceItemSchema],
        subtotal: { type: Number, required: true },
        freightCharges: { type: Number, default: 0 },
        packagingCharges: { type: Number, default: 0 },
        totalGst: { type: Number, default: 0 },
        grandTotal: { type: Number, required: true },
        advancePayment: { type: Number, default: 0 },
        balanceDue: { type: Number, default: 0 },
        paymentTerms: { type: String, default: "" },
        validUntil: { type: Date },
        notes: { type: String, default: "" },
        changedBy: { type: String, default: "Admin" },
        changedAt: { type: Date, default: Date.now },
        reason: { type: String, default: "" }
      }
    ],
    isLocked: {
      type: Boolean,
      default: false
    },
    auditTrail: [
      {
        version: { type: Number },
        changedBy: { type: String, required: true },
        role: { type: String, required: true },
        dateTime: { type: Date, default: Date.now },
        previousValue: { type: String, default: "" },
        newValue: { type: String, default: "" },
        reason: { type: String, default: "" }
      }
    ],
    status: {
      type: String,
      enum: ["Draft", "DRAFT", "Generated", "GENERATED", "Sent", "SENT", "SENT_TO_DEALER", "Revised", "REVISED", "Confirmed", "CONFIRMED", "Paid", "PAID", "Cancelled", "CANCELLED"],
      default: "Sent"
    }
  },
  { timestamps: true }
);

const ProformaInvoice = mongoose.model("ProformaInvoice", proformaInvoiceSchema);

export default ProformaInvoice;
