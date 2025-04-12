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
      return res.json({ message: "User not found!" });
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

    user.resetPasswordToken = token;
    // await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: { address: process.env.USER_MAIL },
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
      <p>The link will expire in 1 day</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    const sendEmail = async (transporter, mailOptions) => {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: "Email sent!" });
    };

    await sendEmail(transporter, mailOptions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
