const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token is required!!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: err });
    }
    console.log(decoded); // Check the decoded token's user info here
    req.user = decoded.user; // Make sure to assign the user to the request
    next();
  });
};

module.exports = { authentication };
