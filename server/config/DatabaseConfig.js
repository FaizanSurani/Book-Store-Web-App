const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const DBConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGOURI}`);
    console.log("Connection Established Succesfully!");
  } catch (error) {
    console.log(error);
  }
};

DBConnect();

module.exports = DBConnect();
