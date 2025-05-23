const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Enter Your Name!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Enter Your Email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Enter Your Password!"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    address: {
      type: String,
      required: [true, "Enter Your Address!"],
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    favourites: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
    payments: [{ type: mongoose.Types.ObjectId, ref: "payment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);
