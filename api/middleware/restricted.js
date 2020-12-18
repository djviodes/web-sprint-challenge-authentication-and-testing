const jwt = require("jsonwebtoken");
const secrets = require("../../config/secrets");
module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  !token && res.status(401).json(`token required.`);
  jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
    err && res.status(500).json(`token invalid.`);
    res.token = decoded;
    next();
  });
};
