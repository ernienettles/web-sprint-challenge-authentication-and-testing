const bcryptjs = require('bcryptjs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const Users = require('../models/user-model');

router.post('/register', (req, res) => {
  const creds = req.body;

  if (Users.isValid(creds)) {
    const rounds = process.env.HASH_ROUNDS || 8;

    const hash = bcryptjs.hashSync(creds.password, rounds);

    creds.password = hash;

    Users.add(creds)
      .then(user => {
        const token = makeToken(user)

        res.status(201).json({ data: user, token });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(400).json({
      message: "Please provide your username and password",
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (Users.isValid(req.body)) {
    Users.findBy({ username })
      .then(([user]) => {

        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user);

          res.status(200).json({ message: "Welcome!", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(400).json({
      message: "Please provide your username and password",
    });
  }
});

function makeToken(user) {
  const payload = {
    object: user.id,
    username: user.username,
    role: user.role
  };

  const secret = process.env.JWT_SECRET || 'This is a secret';

  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
