require('dotenv').config();

const crypto = require('crypto');
const { SECRET_KEY } = process.env;

const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { signInValidation, signUpValidation } = require('../middlewares/Validations/usersValidation');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/signin', signInValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordToCrypto = crypto.pbkdf2Sync(password, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

    const result = await Users.findOne({ where: { email: email, password: passwordToCrypto } });

    if (!result) return res.status(412).json({ message: '아이디와 비밀번호가 일치하지 않습니다.' });

    req.session.user = { email: result.email, name: result.name };
    return res.status(201).json({ message: '로그인 성공' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(412).json({ message: '오류가 발생하였습니다.' });
    return res.status(201).json({ message: '로그아웃 성공' });
  });
});

router.post('/signup', signUpValidation, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const passwordToCrypto = crypto.pbkdf2Sync(password, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

    await Users.create({ email, name, password: passwordToCrypto });
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

module.exports = router;
