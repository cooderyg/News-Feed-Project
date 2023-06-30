require('dotenv').config();

const crypto = require('crypto');
const { SECRET_KEY, NODEMAILER_USER, NODEMAILER_PASS, HOST } = process.env;

const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { signInValidation, signUpValidation, editPasswordValidation } = require('../middlewares/Validations/usersValidation');
const authMiddleware = require('../middlewares/auth-middleware');
const nodemailer = require('nodemailer');
const { off } = require('process');

let transporter = nodemailer.createTransport({
  // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
  service: 'gmail',
  // host를 gmail로 설정
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // Gmail 주소 입력, 'testmail@gmail.com'
    user: NODEMAILER_USER,
    // Gmail 패스워드 입력
    pass: NODEMAILER_PASS,
  },
});

router.post('/signin', signInValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordToCrypto = crypto.pbkdf2Sync(password, SECRET_KEY.toString('hex'), 11524, 64, 'sha512').toString('hex');

    const userValid = await Users.findOne({ where: { email: email, password: passwordToCrypto }, attributes: { exclude: ['password'] } });
    const isEmailValid = await Users.findOne({ where: { email: email, password: passwordToCrypto, isEmailValid: true }, attributes: { exclude: ['password'] } });

    if (!userValid) return res.status(412).json({ message: '아이디와 비밀번호가 일치하지 않습니다.' });
    if (!isEmailValid) return res.status(412).json({ message: '해당 계정은 이메일 인증이 이루어지지 않은 계정입니다.\n메일을 확인해 주세요.' });

    req.session.user = userValid;
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
    await Users.create({ email, name, password: passwordToCrypto, isEmailValid: false });
    const url = `http://${HOST}/api/users?email=${email}`;

    await transporter.sendMail({
      // 보내는 곳의 이름과, 메일 주소를 입력
      from: `"piggy path" <${NODEMAILER_USER}>`,
      // 받는 곳의 메일 주소를 입력
      to: email,
      // 보내는 메일의 제목을 입력
      subject: '[piggy path] 회원가입 인증 메일입니다.',
      // 보내는 메일의 내용을 입력
      // text: 일반 text로 작성된 내용
      // html: html로 작성된 내용
      html: `<form action="${url}" method="POST">
      <button>가입확인</button>
    </form>`,
    });

    return res.status(201).json({ message: '회원가입이 완료되었습니다.\n단, 사용자의 이메일 인증 후 로그인이 가능합니다.\n메일을 확인해 주세요.' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: '오류가 발생하였습니다.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(412).render('authResult', { message: '비정상적인 접근입니다.???' });

    const emailValid = await Users.findOne({ where: { email: email }, attributes: ['email', 'isEmailValid'] });

    if (!emailValid) return res.status(412).render('authResult', { message: '해당 이메일은 요청된 이메일이 아닙니다.' });
    if (emailValid.isEmailValid) return res.status(412).render('authResult', { message: '이미 인증된 이메일 입니다.' });

    await Users.update({ isEmailValid: true }, { where: { email: email } });

    return res.status(201).render('authResult', { message: '인증이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(400).render('authResult', { message: '오류가 발생하였습니다.' });
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
