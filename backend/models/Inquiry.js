import mongoose from "mongoose";

const inquiryItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false
  },
  name: {
    type: String,
    required: true
  },
  model: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  specification: {
    type: String,
    default: ""
  },
  dealerRemarks: {
    type: String,
    default: ""
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  amount: {
    type: Number,
    default: 0
  }
});

const inquirySchema = new mongoose.Schema(
  {
    inquiryNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true
    },
    items: [inquiryItemSchema],
    requiredDeliveryDate: {
      type: Date
    },
    dealerRemarks: {
      type: String,
      default: ""
    },
    adminNotes: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "UNDER_REVIEW",
        "INQUIRY_REJECTED",
        "PI_DRAFT",
        "PI_GENERATED",
        "PI_SENT_TO_DEALER",
        "PI_NEGOTIATION",
        "PI_CONFIRMED",
        "PO_GENERATED",
        "AWAITING_SIGNED_PO",
        "SIGNED_PO_UPLOADED",
        "SIGNED_PO_APPROVED",
        "SIGNED_PO_REJECTED",
        "ORDER_CONFIRMED",
        "CANCELLED"
      ],
      default: "SUBMITTED"
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

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
