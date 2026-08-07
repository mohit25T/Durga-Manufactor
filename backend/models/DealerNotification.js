import mongoose from "mongoose";

const dealerNotificationSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DealerOrder"
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["status_update", "price_update", "approval_update", "order_created"],
      default: "status_update"
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const DealerNotification = mongoose.model("DealerNotification", dealerNotificationSchema);

export default DealerNotification;
