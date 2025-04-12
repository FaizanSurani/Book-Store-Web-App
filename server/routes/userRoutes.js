const router = require("express").Router();
const user = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult, body } = require("express-validator");

router.post(
  "/sign-up",
  [
    body("username").isLength({ min: 6 }),
    body("email").isEmail(),
    body("password").isLength({ min: 4 }),
  ],
  async (req, res) => {
    const { username, email, password, address } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(password, salt);

    try {
      const existinguser = await user.findOne({ username: username });
      if (existinguser) {
        return res.status(400).json({ message: "User Already Exists!!" });
      }

      const existingEmail = await user.findOne({ email: email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email Already in Use!!" });
      }

      const User = new user({
        username,
        email,
        password: secPassword,
        address,
      });
      await User.save();
      return res.status(200).json({ message: "User Created Succesfully!!" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await user.findOne({ email });
    if (!userData) {
      return res
        .status(400)
        .json({ message: "Trying Logging with correct Credentials!" });
    }

    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Trying Logging with correct Credentials!" });
    }

    const data = {
      user: {
        id: userData._id,
        role: userData.role,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY);
    return res.status(200).json({
      id: userData._id,
      role: userData.role,
      authToken: authToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
