require('dotenv').config();

const crypto = require('crypto');
const { SECRET_KEY } = process.env;

const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { signin } = require('../middlewares/Validations/usersValidation');

router.post('/register', (req, res) => {
  res.send('test');
});

router.post('/signin', signin, async (req, res) => {
  const { email, password } = req.body;
  const passwordToCrypto = crypto.pbkdf2Sync(password, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

  console.log(passwordToCrypto);

  res.json(1);
});

module.exports = router;
