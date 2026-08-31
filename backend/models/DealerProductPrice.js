import mongoose from "mongoose";

const dealerProductPriceSchema = new mongoose.Schema(
  {
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      default: "",
    },
    customPrice: {
      type: Number,
      required: true,
    },
    lastAgreedDate: {
      type: Date,
      default: Date.now,
    },
    poNumber: {
      type: String,
      default: "",
    },
    piNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound unique index for dealerId + productId
dealerProductPriceSchema.index({ dealerId: 1, productId: 1 }, { unique: true });

export default mongoose.model("DealerProductPrice", dealerProductPriceSchema);
