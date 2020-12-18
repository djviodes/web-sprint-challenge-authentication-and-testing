const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../../config/secrets");
const { getUserByUsername, addUser } = require("./auth-models");

router.post("/register", checkBody, (req, res) => {
  getUserByUsername(req.body.username).then((data) => {
    if (data) {
      res.status(400).json("username taken");
    } else {
      const credentials = req.body;
      const hash = bcrypt.hashSync(credentials.password, 14);
      credentials.password = hash;
      addUser(credentials).then((data) => {
        res.status(201).json(data);
      });
    }
  });
});

router.post("/login", checkBody, (req, res) => {
  getUserByUsername(req.body.username).then((data) => {
    if (!data || !bcrypt.compareSync(req.body.password, data.password)) {
      res.status(401).json("invalid credentials");
    } else {
      const token = generateToken(data);
      res.status(200).json({
        message: `Welcome ${data.username}! Have a token...`,
        token,
      });
    }
  });
});

function checkBody(req, res, next) {
  if (!req.body.password || !req.body.username) {
    res.status(500).json("username and password required");
  } else {
    next();
  }
}

function generateToken(user) {
  const payload = {
    subject: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
