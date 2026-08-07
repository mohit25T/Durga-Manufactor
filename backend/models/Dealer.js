import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      default: ""
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    city: {
      type: String,
      trim: true,
      default: ""
    },
    state: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    tier: {
      type: String,
      enum: ["Standard", "Bronze", "Silver", "Gold", "Platinum"],
      default: "Standard"
    },
    discountPercent: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

const Dealer = mongoose.model("Dealer", dealerSchema);

export default Dealer;
