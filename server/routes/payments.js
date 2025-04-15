const router = require("express").Router();
const { authentication } = require("../routes/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const payment = require("../models/PaymentSchema");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const express = require("express");
const user = require("../models/UserSchema");

router.post("/create-checkout-session", authentication, async (req, res) => {
  try {
    const { items, orderIDs } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
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
        orders: JSON.stringify(orderIDs),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: "Failed to create Stripe checkout session" });
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
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        await payment.create({
          user: session.metadata.user,
          orders: JSON.parse(session.metadata.orders),
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          status: "Completed",
        });
      }

      await user.findByIdAndUpdate(session.metadata.user, {
        $push: { payments: payment._id },
      });

      res.json({ received: true });
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

module.exports = router;
