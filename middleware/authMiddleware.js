const jwt = require("jsonwebtoken");

// Middleware function to check the JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
