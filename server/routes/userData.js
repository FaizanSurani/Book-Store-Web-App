const router = require("express").Router();
const { authentication } = require("./auth");
const user = require("../models/UserSchema");
const bcryptjs = require("bcryptjs");

router.get("/getUser", authentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await user.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
