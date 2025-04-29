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
    console.log(req.user.id, "user id from place order route");

    if (!req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    for (const item of order) {
      if (!item.title || !item.price) {
        return res.status(400).json({ message: "Invalid item in order" });
      }
    }

    const total = order.reduce((sum, item) => sum + item.price, 0);

    const newOrder = new Order({
      user: req.user.id,
      items: order.map((item) => ({
        Book: item._id,
        quantity: item.quantity || 1,
        price: item.price,
      })),
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
      cancel_url: `${process.env.FRONTEND_URL}/api/v1/cart`,

      customer_details: {
        name: "John Sharma",
        email: req.user.email || "demo@example.com",
        address: {
          line1: "221B Baker Street",
          city: "Mumbai",
          state: "Maharashtra",
          postal_code: "400001",
          country: "IN",
        },
      },

      shipping_address_collection: {
        allowed_countries: ["IN"],
      },

      metadata: {
        user: req.user.id.toString(),
        orders: JSON.stringify([newOrder._id]),
      },
    });

    return res.status(200).json({
      message: "Order Placed SuccessFully!!",
      sessionURL: session.url,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error!!", error: error.message });
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

        if (
          !session.metadata ||
          !session.metadata.user ||
          !session.metadata.orders
        ) {
          return res.status(400).send("Invalid metadata");
        }

        const orderIDs = JSON.parse(session.metadata.orders);

        await Order.updateMany(
          { _id: { $in: orderIDs } },
          { $set: { paymentStatus: "Paid" } }
        );

        const createdPayment = await payment.create({
          user: session.metadata.user,
          orders: orderIDs,
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          status: "Completed",
        });

        await user.findByIdAndUpdate(session.metadata.user, {
          $push: {
            payments: createdPayment._id,
            orders: { $each: orderIDs },
          },
          $pull: {
            cart: { $in: orderIDs },
          },
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
      populate: { path: "items.Book" },
    });

    console.log("User data retrieved:", userData);

    const ordersData = userData.orders ? userData.orders.reverse() : [];
    return res.status(200).json({ data: ordersData });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.get("/allOrders", authentication, async (req, res) => {
  try {
    const usersOrder = await Order.find()
      .populate({ path: "items.Book" })
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

// Add this route in your router (for testing purposes)
router.get("/testAuth", authentication, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

module.exports = router;
