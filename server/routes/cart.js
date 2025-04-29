const router = require("express").Router();
const user = require("../models/UserSchema");
const { authentication } = require("./auth");

router.put("/addItems", authentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    const userData = await user.findById(id);
    const isBookinCart = userData.cart.includes(bookid);

    if (isBookinCart) {
      return res.status(200).json({ message: "Book is Already in cart!!" });
    }

    await user.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "Book Added to the Cart!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.put("/removeItems/:bookid", authentication, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    await user.findByIdAndUpdate(id, { $pull: { cart: bookid } });

    return res.status(200).json({ message: "Book Removed from the Cart!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.get("/cartItems", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await user.findById(id).populate("cart");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = userData.cart.reverse();

    return res.status(200).json({ data: cartItems });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

module.exports = router;
