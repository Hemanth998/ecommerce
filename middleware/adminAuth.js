const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "unauthorized access,No Token" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    if (decoded.user.userType !== "Admin") {
      return res.status(401).json({ msg: "Not an admin User" });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "invalid token" });
  }
};
