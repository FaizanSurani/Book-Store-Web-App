const router = require("express").Router();
const Book = require("../models/BookSchema");

router.get("/getAllBooks", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    console.log(books);
    return res.status(200).json({ data: books });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.get("/getRecentBooks", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(8);
    return res.status(200).json({ data: books });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

router.get("/bookid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookDesc = await Book.findById(id);
    return res.status(200).json({ message: "Success!!", data: bookDesc });
  } catch (error) {
    return res.status(500).json({ message: "Server Error!!" });
  }
});

module.exports = router;
