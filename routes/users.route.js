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

    req.session.user = { email: result.email, name: result.name, userId: result.userId };
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

// 회원가입
router.post('/signup', async (req, res) => {
  console.log('/signup');
  const { email, name, password } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  // Users 테이블에 사용자를 추가합니다.
  try {
    await Users.create({ email, name, password });
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    // 예외케이스에서 처리하지 못한 에러
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });

  // user가 존재하지 않거나 user를 찾았지만, user의 비밀번호와 입력한 비밀번호가 다를때
  if (!user || password !== user.password) {
    res.status(412).json({
      errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
    });
    return;
  }

  try {
    //jwt를 생성하고
    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.SECRET_KEY
    );
    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인에 성공하였습니다.' }); //response 할당
  } catch (error) {
    res.status(400).json({
      errorMessage: `로그인에 실패하였습니다.{$eㄱ}`, // 예외 케이스에서 처리하지 못한 에러
    });
  }
});

module.exports = router;
