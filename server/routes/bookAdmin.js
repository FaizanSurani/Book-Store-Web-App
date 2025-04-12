const router = require("express").Router();
const user = require("../models/UserSchema");
const books = require("../models/BookSchema");
const { authentication } = require("./auth");

router.post("/addBook", authentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const { url, title, author, price, description, language } = req.body;
    const verify = await user.findById(id);

    if (verify.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have access to this functionality!!" });
    }

    await books.create({
      url: url,
      title: title,
      author: author,
      price: price,
      description: description,
      language: language,
    });
    return res.status(200).json({ message: "Book Added to Database" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.put("/updateBook", authentication, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const { url, title, author, price, description, language } = req.body;
    console.log("UpdateBook Request Headers:", req.headers);
    console.log("UpdateBook Request Body:", req.body);

    const updatedBook = await books.findByIdAndUpdate(
      bookid,
      {
        url,
        title,
        author,
        price,
        description,
        language,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Book Updated to Database", updatedBook });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.delete("/deleteBook", authentication, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await books.findByIdAndDelete(bookid);
    return res.status(200).json({ message: "Book Deleted from Database" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

module.exports = router;
