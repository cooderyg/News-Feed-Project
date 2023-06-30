require('dotenv').config();

const crypto = require('crypto');
const { SECRET_KEY } = process.env;

const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { signInValidation, signUpValidation, editPasswordValidation } = require('../middlewares/Validations/usersValidation');
const authMiddleware = require('../middlewares/auth-middleware');
const { where } = require('sequelize');

router.post('/signin', signInValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordToCrypto = crypto.pbkdf2Sync(password, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

    const result = await Users.findOne({ where: { email: email, password: passwordToCrypto }, attributes: { exclude: ['password'] } });

    if (!result) return res.status(412).json({ message: '아이디와 비밀번호가 일치하지 않습니다.' });

    req.session.user = result;
    return res.status(201).json({ message: '로그인 성공' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(412).json({ message: '오류가 발생하였습니다.' });
    return res.status(201).redirect('../../');
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

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.session.user;
    const user = await Users.findOne({ where: { userId } });
    res.status(200).json({ user });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, introduction, profileImage } = req.body;
    const { userId } = req.session.user;

    const result = await Users.update(
      { name, introduction, profileImage },
      {
        where: {
          userId,
        },
      }
    );
    console.log(result);
    res.status(200).json({ message: '수정에 성공하였습니다.' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

router.put('/editpassword', authMiddleware, editPasswordValidation, async (req, res) => {
  try {
    const { currentPassword, editPassword } = req.body;
    const { userId } = req.session.user;
    const currentPasswordToCrypto = crypto.pbkdf2Sync(currentPassword, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');
    const editPasswordToCrypto = crypto.pbkdf2Sync(editPassword, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

    const currentPasswordValidation = await Users.findOne({ where: { userId, password: currentPasswordToCrypto } });

    if (!currentPasswordValidation) return res.status(412).json({ message: '현재 비밀번호가 일치하지 않습니다.' });

    await Users.update({ password: editPasswordToCrypto }, { where: { userId } });

    req.session.destroy((err) => {
      if (err) return res.status(412).json({ message: '오류가 발생하였습니다.' });
      return res.status(201).json({ message: '비밀번호가 정상 변경되어 새로운 비밀번호로 로그인이 필요합니다.' });
    });
  } catch (err) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

module.exports = router;
