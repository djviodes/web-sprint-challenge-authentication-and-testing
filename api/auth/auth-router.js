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
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post("/login", checkBody, (req, res) => {
  getUserByUsername(req.body.username).then((data) => {
    if (!data || !bcrypt.compareSync(req.body.password, data.password)) {
      res.status(401).json("invalid credentials");
    } else {
      const token = generateToken(data);
      res.status(200).json({
        message: `Welcome ${data.username}! Have a token...`,
        token, // attach the token as part of the response
      });
    }
  });
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
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
