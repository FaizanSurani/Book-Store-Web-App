const router = require("express").Router();
const user = require("../models/UserSchema");
const { authentication } = require("./auth");

router.put("/addFavourites", authentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await user.findById(id);

    const isFav = userData.favourites.includes(bookid);
    if (isFav) {
      return res.status(200).json({ message: "Book is already in it!" });
    }

    await user.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book added to favourites!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.put("/deleteFavourites", authentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await user.findById(id);

    const isFav = userData.favourites.includes(bookid);
    if (isFav) {
      await user.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
    }
    return res.status(200).json({ message: "Book removed from favourites!!" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.get("/getFavouriteBooks", authentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await user.findById(id).populate("favourites");

    const favouritesBooks = userData.favourites;

    return res.status(200).json({ data: favouritesBooks });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

module.exports = router;
