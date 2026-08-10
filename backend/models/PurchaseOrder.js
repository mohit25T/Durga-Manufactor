import mongoose from "mongoose";

const poItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false
  },
  name: { type: String, required: true },
  model: { type: String, default: "" },
  description: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  taxableAmount: { type: Number, required: true },
  gstRate: { type: Number, default: 18 },
  gstAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    poDate: {
      type: Date,
      default: Date.now
    },
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
      required: false
    },
    proformaInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProformaInvoice",
      required: true
    },
    piVersionNumber: {
      type: Number,
      required: true,
      default: 1
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true
    },
    sellerDetails: {
      companyName: { type: String, default: "Durga Manufactures" },
      brand: { type: String, default: "Millzon" },
      gstin: { type: String, default: "24HMPT0206E1ZO" },
      pan: { type: String, default: "HMPT0206E" },
      udyam: { type: String, default: "GJ-20-0130533" },
      address: { type: String, default: "Plot No. A5, Shapar Main Road, Opp. Mahindra Gear, Decora Cement Campus, Shapar (Veraval) 360024, Rajkot, Gujarat, India." },
      phone: { type: String, default: "+91 94281 56213, +91 98258 70821" },
      email: { type: String, default: "durgamanufactures2010@gmail.com" },
      bankName: { type: String, default: "Bank Of Baroda, Aji GIDC, Rajkot" },
      accountName: { type: String, default: "DURGA MANUFACTURES" },
      accountNumber: { type: String, default: "17400200000634" },
      ifscCode: { type: String, default: "BARB0AJIRAJ" }
    },
    buyerDetails: {
      dealerName: { type: String, required: true },
      companyName: { type: String, default: "" },
      gstin: { type: String, default: "" },
      billingAddress: { type: String, required: true },
      shippingAddress: { type: String, default: "" },
      contactPerson: { type: String, default: "" },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "Gujarat" }
    },
    items: [poItemSchema],
    financials: {
      subtotal: { type: Number, required: true, default: 0 },
      freightCharges: { type: Number, default: 0 },
      packagingCharges: { type: Number, default: 0 },
      isInterstate: { type: Boolean, default: false },
      cgstAmount: { type: Number, default: 0 },
      sgstAmount: { type: Number, default: 0 },
      igstAmount: { type: Number, default: 0 },
      totalGst: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true, default: 0 },
      advancePayment: { type: Number, default: 0 },
      balanceDue: { type: Number, default: 0 }
    },
    commercialTerms: {
      paymentTerms: { type: String, default: "50% Advance with Purchase Order, 50% before Dispatch." },
      deliveryTerms: { type: String, default: "Ex-factory Rajkot, Gujarat." },
      warrantyTerms: { type: String, default: "1 Year Pan-India Warranty." },
      installationTerms: { type: String, default: "Electric panel board, wiring on customer." },
      freightTerms: { type: String, default: "Transportation charges on customer." },
      otherTerms: { type: String, default: "" }
    },
    signedPoDocument: {
      fileUrl: { type: String, default: "" },
      fileName: { type: String, default: "" },
      fileType: { type: String, default: "" },
      uploadedAt: { type: Date },
      uploadedBy: { type: String, default: "" },
      status: {
        type: String,
        enum: ["NOT_UPLOADED", "PENDING", "APPROVED", "REJECTED"],
        default: "NOT_UPLOADED"
      },
      rejectionReason: { type: String, default: "" },
      reviewedAt: { type: Date },
      reviewedBy: { type: String, default: "" }
    },
    status: {
      type: String,
      enum: [
        "GENERATED",
        "AWAITING_DEALER_SIGNATURE",
        "SIGNED_PO_UPLOADED",
        "SIGNED_PO_APPROVED",
        "SIGNED_PO_REJECTED",
        "ORDER_CONFIRMED",
        "CANCELLED"
      ],
      default: "AWAITING_DEALER_SIGNATURE"
    },
    isCommerciallyLocked: {
      type: Boolean,
      default: false
    },
    auditTrail: [
      {
        action: { type: String, required: true },
        performedBy: { type: String, required: true },
        role: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: "" }
      }
    ]
  },
  { timestamps: true }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
