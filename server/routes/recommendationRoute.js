const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/recommendation_api/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await axios.get(
      `http://127.0.0.1:3000/recommendation_api/${user_id}`
    );
    const recommended_products = response.data.recommended_products;
    res.json({ recommended_products });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
