const express = require("express");
require("dotenv").config();
const DBConnect = require("./config/DatabaseConfig");
const app = express();
const cors = require("cors");

DBConnect();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/userData"));
app.use("/api/v1", require("./routes/updateProfile"));
app.use("/api/v1", require("./routes/bookAdmin"));
app.use("/api/v1", require("./routes/bookUser"));
app.use("/api/v1", require("./routes/favouritesRoute"));
app.use("/api/v1", require("./routes/cart"));
app.use("/api/v1", require("./routes/order"));
app.use("/api/v1", require("./routes/forgotPassword"));
app.use("/api/v1", require("./routes/resetPassword"));
app.use("/api/v1", require("./routes/recommendationRoute"));
app.use("/api/v1", require("./routes/payments"));

app.listen(process.env.PORT, () => {
  console.log(`Server Listening to ${process.env.PORT}`);
});
