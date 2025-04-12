const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authentication } = require("./auth");
const user = require("../models/UserSchema");
require("dotenv").config();

router.put("/resetPassword/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    const userId = decoded.user.id;
    const userToUpdate = await user.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(password, salt);

    const updatedPass = await user.findByIdAndUpdate(userId, {
      password: secPassword,
    });
    updatedPass.save();

    return res.status(200).json({ message: "Password Updated!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
