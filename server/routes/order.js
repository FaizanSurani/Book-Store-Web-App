const router = require("express").Router();
const { authentication } = require("../routes/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const payment = require("../models/PaymentSchema");
const express = require("express");
const user = require("../models/UserSchema");
const Order = require("../models/OrdersSchema");
const endpointSecret = process.env.endpointSecret;

router.post("/placeOrder", authentication, async (req, res) => {
  try {
    const { order } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const total = order.reduce((sum, item) => sum + item.price, 0);

    const newOrder = new Order({
      user: req.user._id,
      items: order,
      paymentStatus: "Pending",
      total,
    });

    await newOrder.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.title },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity || 1,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        user: req.user._id.toString(),
        orders: JSON.stringify([newOrder._id]),
      },
    });

    return res.status(200).json({
      message: "Order Placed SuccessFully!!",
      sessionURL: session.url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const orderIDs = JSON.parse(session.metadata.orders);

        await orders.updateMany(
          { _id: { $in: orderIDs } },
          { $set: { paymentStatus: "Paid" } }
        );

        await payment.create({
          user: session.metadata.user,
          orders: orderIDs,
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          status: "Completed",
        });

        await user.findByIdAndUpdate(session.metadata.user, {
          $push: { payments: payment._id },
        });

        await user.findByIdAndUpdate(session.metadata.user, {
          $push: { orders: { $each: orderIDs } },
        });

        await user.findByIdAndUpdate(session.metadata.user, {
          $pull: { cart: { $in: orderIDs } },
        });

        res.json({ received: true });
      } else {
        res.status(400).send("Unhandled event type");
      }
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

router.get("/orderHistory", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await user.findById(id).populate({
      path: "orders",
      populate: { path: "Book" },
    });

    const ordersData = userData.orders.reverse();
    return res.status(200).json({ data: ordersData });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.get("/allOrders", authentication, async (req, res) => {
  try {
    const usersOrder = await Order.find()
      .populate({ path: "Book" })
      .populate({ path: "user" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: usersOrder });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.put("/updateStatus/:id", authentication, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res
      .status(200)
      .json({ message: "Orders Status Updated Succesfully!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

module.exports = router;
