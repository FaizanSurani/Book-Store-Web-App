const express = require("express");
require("dotenv").config();
const DBConnect = require("./config/DatabaseConfig");
const app = express();
const cors = require("cors");

DBConnect();

app.use(express.json());

app.all("*", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
    "id",
    "bookid"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
});

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

app.listen(process.env.PORT, () => {
  console.log(`Server Listening to ${process.env.PORT}`);
});
