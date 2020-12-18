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
  /*
    IMPLEMENT
    1- On valid token in the Authorization header, call next.
    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".
    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
