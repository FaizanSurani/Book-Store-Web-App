const router = require("express").Router();
const Order = require("../models/OrdersSchema");
const Book = require("../models/BookSchema");
const user = require("../models/UserSchema");
const { authentication } = require("./auth");

router.post("/placeOrder", authentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    for (const orderData of order) {
      const newOrder = new Order({ user: id, Book: orderData._id });
      const orderDb = await newOrder.save();

      await user.findByIdAndUpdate(id, {
        $push: { orders: orderDb._id },
      });
      await user.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.status(200).json({ message: "Order Placed SuccessFully!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

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
