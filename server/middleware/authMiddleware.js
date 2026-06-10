const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Grab the token from the "Bearer <token>" string
      token = req.headers.authorization.split(" ")[1];

      // Decrypt the token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");

      // Attach the user ID to the request so the controller can use it
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };