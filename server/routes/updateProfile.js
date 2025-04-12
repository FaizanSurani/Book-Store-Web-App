const user = require("../models/UserSchema");
const { authentication } = require("./auth");
const bcryptjs = require("bcryptjs");

const router = require("express").Router();

router.put("/updateProfile", authentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const { username, email, password, address } = req.body;

    // const salt = await bcryptjs.genSalt(10);
    // const secPassword = await bcryptjs.hash(password, salt);

    await user.findByIdAndUpdate(id, {
      username: username,
      email: email,
      // password: secPassword,
      address: address,
    });
    return res.status(200).json({ message: "Profile Updated!!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
