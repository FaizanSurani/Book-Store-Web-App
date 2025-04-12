const router = require("express").Router();
const user = require("../models/UserSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  try {
    const userData = await user.findOne({ email });
    if (!userData) {
      return res.status(404).json({ message: "User not found!" });
    }

    const data = {
      user: {
        id: userData.id,
      },
    };

    console.log(data);

    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    userData.resetPasswordToken = token;
    await userData.save();

    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
        <p>The link will expire in 1 day</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
