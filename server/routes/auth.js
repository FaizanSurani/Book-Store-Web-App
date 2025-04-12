const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is required!!" });
  }

  jwt.verify(token, "Unknown String", (err, user) => {
    if (err) {
      return res.status(403).json({ message: err });
    }
    req.user = user;
    next();
  });
};

module.exports = { authentication };
