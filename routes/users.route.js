require('dotenv').config();

const crypto = require('crypto');
const { SECRET_KEY } = process.env;

const express = require('express');
const router = express.Router();
const { Users } = require('../models');

router.post('/register', (req, res) => {
  res.send('test');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(412).json({ message: '이메일 값은 필수입니다.' });
  if (!password) return res.status(412).json({ message: '비밀번호 값은 필수입니다.' });

  if (!/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(email)) return res.status(412).json({ message: '이메일 형식이 올바르지 않습니다.' });
  if (!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/.test(password)) return res.status(412).json({ message: '비밀번호 형식이 올바르지 않습니다.' });

  const passwordToCrypto = crypto.pbkdf2Sync(password, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

  //추 후 비밀번호 추가여부 확인 필요
  console.log(passwordToCrypto);

  res.json(1);
});

module.exports = router;
