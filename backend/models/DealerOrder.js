import mongoose from "mongoose";

const dealerOrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  productTitle: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  discountedPrice: {
    type: Number,
    default: 0
  }
});

const dealerOrderSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true
    },
    items: [dealerOrderItemSchema],
    subtotal: {
      type: Number,
      default: 0
    },
    includeFullGst: {
      type: Boolean,
      default: true
    },
    billAmount: {
      type: Number,
      default: 0
    },
    withoutBillAmount: {
      type: Number,
      default: 0
    },
    gstAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"],
      default: "Pending"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const DealerOrder = mongoose.model("DealerOrder", dealerOrderSchema);

export default DealerOrder;
