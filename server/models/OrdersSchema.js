const mongoose = require("mongoose");

const orders = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    Book: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed" || "Out For Delivery, Delivered, Cancelled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orders);
