const router = require("express").Router();
const bcrypt = require("bcrypt");
const Users = require("../users/users-model");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
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
  function isValid(user) {
    return Boolean(
      user.username && user.password && typeof user.password === "string"
    );
  }
  if (isValid(req.body)) {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 14);
      const user = { username, password: hash };
      const addedUser = Users.add(user);
      res.status(200).json(addedUser);
    } catch (err) {
      res.status(500).json({ message: "username taken" });
    }
  } else {
    res.status(400).json({
      message: "username and password required",
    });
  }
});

router.post("/login", (req, res) => {
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
 const { username, password } = req.body;
 function isValid(user) {
   return Boolean(
     user.username && user.password && typeof user.password === "string"
     );
    }
    
    if (isValid(req.body)) {
      Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = makeToken(user);
          res.status(200).json({ message: "Welcome to our API", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
    } else {
      res.status(400).json({
        message: "username and password required",
      });
    }
  });
  
  const { jwtSecret } = require("./secret");
  function makeToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role: user.role,
      foo: "bar",
    };
    const options = {
      expiresIn: "5 minutes",
    };
    return jwt.sign(payload, jwtSecret, options);
  }
  
  module.exports = router;
  