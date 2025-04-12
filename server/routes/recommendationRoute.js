const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/recommendations/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await axios.get(
      `http://localhost:3000/recommendations/${user_id}`
    );

    const recommended_products = await response.data.recommended_products;

    res.json({ recommended_products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
