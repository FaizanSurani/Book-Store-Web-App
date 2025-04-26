const mongoose = require("mongoose");

const payment = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
    stripeSessionId: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", payment);
